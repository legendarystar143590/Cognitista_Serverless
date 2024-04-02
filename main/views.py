from curses.ascii import US
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.http import StreamingHttpResponse
from .models import collection, filemodel, promptmodel, buffermodel, indexmodel, llmpermissionmodel, indexpermissionmodel, llmmodel, promptpermissionmodel, vectormodel

import json, os
from dotenv import load_dotenv

from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory

# from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings

# from langchain.vectorstores import Pinecone
from langchain.llms import Together, Bedrock
# from langchain.chat_models import BedrockChat
from langchain_community.chat_models import BedrockChat
from langchain.chat_models import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.text_splitter import CharacterTextSplitter
from langchain_pinecone import PineconeVectorStore

# from langchain.document_loaders import PyMuPDFLoader
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.chat_models import BedrockChat as Sonnet

import time, uuid

from pinecone import Pinecone, PodSpec, ServerlessSpec

load_dotenv()

pinecone_api_key = os.getenv('PINECONE_API_KEY')
pinecone_env = os.getenv('PINECONE_ENV')
openai_api_key = os.getenv('OPENAI_API_KEY')
together_api_key = os.getenv('together_api_key')
    
pc = Pinecone(api_key=pinecone_api_key)

@login_required(login_url="/accounts/signin/")
def home(request):
    email = request.user.email
    data = {
        'online_users': 8,
        'total_members': 25,
        'is_admin': check_admin(email)
    }
    
    return render(request, 'index.html', data)

@login_required(login_url="/accounts/signin/")
def chatbot(request):
    email = request.user.email
    name = User.objects.get(email=email)
    prompt_data = promptpermissionmodel.objects.filter(email=email, status=True)
    prompt_list = []
    if prompt_data.count() != 0:
        for prompt in prompt_data:
            title = prompt.value
            
            print(title)
            content = promptmodel.objects.get(title=title).prompt
            prompt_list.append({"title": title, "content": content})
            
    show_prompt_select = False
    if len(prompt_list) > 1:
        show_prompt_select = True

    index_list = []
    index_data = indexmodel.objects.all()

    for index in index_data:
        count = indexpermissionmodel.objects.filter(index_name=index.index_name, status=True, email=email).count()
        if count > 0:
            index_list.append(index.index_name)

    show_index_select = True
    if len(index_list) == 1:
        show_index_select = False

    model_list = []
    
    llms = llmpermissionmodel.objects.filter(email=email, status=True)
    
    for llm in llms:
        value = llm.value
        key = llmmodel.objects.get(value=value).llm
        
        model_list.append({"llm": key, "value": value})

    vector = 4
    try:
        vector = vectormodel.objects.get(email=email).value
    except:
        pass
    
    collection_list = []
    
    collection_list = []
    if show_index_select == False:
        s_index_name = index_list[0]
        results = indexpermissionmodel.objects.filter(index_name = s_index_name, email=email, status=True)
        for res in results:
            collection_list.append(res.collection_name)

    show_initial_collection_select = True
    if len(collection_list) == 1:
        show_initial_collection_select = False

    data = {
        'prompt_list': prompt_list, 'index_list': index_list, 'name': name, 'email': email, 'model_list': model_list, 'is_admin': check_admin(email), 'show_index_select': show_index_select, 'show_prompt_select': show_prompt_select, 'vector': vector, 'show_initial_collection_select': show_initial_collection_select, 'collection_list': collection_list
    }
    
    return render(request, 'ai-chat-bot.html', data)


@login_required(login_url="/accounts/signin/")
def permission(request):
    email = request.user.email
    user_list = [user.username for user in User.objects.all()]    

    return render(request, 'permission.html', {'user_list': user_list, "is_admin": check_admin(email)})

def getpermissioninfo(request):
    user_name = request.POST.get('user_name')
    user_email = User.objects.get(username=user_name).email

    index_list = [index.index_name for index in indexmodel.objects.all()]

    collection_list = {}
    for index in index_list:
        collection_list[index] = [coll.collection_name for coll in collection.objects.filter(index_name=index)]

    index_data = {}
    for index_name, collections in collection_list.items():
        index_data[index_name] = {} 
        index_data[index_name]['total_status'] = False
        index_data[index_name]['collections'] = {}
        for collection_name in collections:
            try:
                status = indexpermissionmodel.objects.get(email=user_email, index_name=index_name, collection_name=collection_name).status
                if status == True:
                    index_data[index_name]['total_status'] = True
                    index_data[index_name]['collections'][collection_name] = True 
                else:
                    index_data[index_name]['collections'][collection_name] = False
            except:
                index_data[index_name]['collections'][collection_name] = False

    
    llm_data = {}
    llm_list = llmmodel.objects.all()
    for llm in llm_list:
        value = llm.value
        llm_data[value] = False
        try:
            status = llmpermissionmodel.objects.get(email=user_email, value=value).status
            if status == True:
                llm_data[value] = True
        except:
            pass
    
    prompt_data = {}
    prompt_list = [prompt.title for prompt in promptmodel.objects.all()] 
    
    for prompt in prompt_list:
        prompt_data[prompt] = False
        try:
            status = promptpermissionmodel.objects.get(email=user_email, value=prompt).status
            if status:
                prompt_data[prompt] = True
        except:
            pass
    
    vector = 4
    try:
        vector = vectormodel.objects.get(email=user_email).value
    except:
        pass
    print(prompt_data)
    return JsonResponse({"index_data": index_data, "llm_data": llm_data, "prompt_data": prompt_data, 'vector': vector})

def setvectorpermission(request):
    username = request.POST.get('username')
    value = request.POST.get('value')
    email = User.objects.get(username=username).email

    value = int(value)

    record = vectormodel.objects.filter(email=email).exists()
    if record:
        vectormodel.objects.filter(email=email).update(value=value)
    else:
        vectormodel.objects.create(email=email, value=value).save()
    return JsonResponse({"success": "ok"})

def setllmpermission(request):
    username = request.POST.get('username')
    llm = request.POST.get('llm')
    email = User.objects.get(username=username).email
    try:
        status = llmpermissionmodel.objects.get(email=email, value=llm).status
        
        if status == True:
            llmpermissionmodel.objects.filter(email=email, value=llm).update(status=False)
        else:
            llmpermissionmodel.objects.filter(email=email, value=llm).update(status=True)
    except:
        llmpermissionmodel.objects.create(email=email, value=llm, status=True).save()
        
    return JsonResponse({"success": "ok"})

def setadminpermission(request):
    id = request.POST.get("id")
    status = User.objects.get(id=id).is_staff
    status = not status
    print(status)
    User.objects.filter(id=id).update(is_staff=status)

    return JsonResponse({"success": "ok"})
def setpromptpermission(request):
    username = request.POST.get('username')
    prompt = request.POST.get('prompt')
    email = User.objects.get(username=username).email
    try:
        status = promptpermissionmodel.objects.get(email=email, value=prompt).status
        
        if status == True:
            promptpermissionmodel.objects.filter(email=email, value=prompt).update(status=False)
        else:
            promptpermissionmodel.objects.filter(email=email, value=prompt).update(status=True)
    except:
        promptpermissionmodel.objects.create(email=email, value=prompt, status=True).save()
        
    return JsonResponse({"success": "ok"})


def setcollectionpermission(request):
    username = request.POST.get('username')
    collection_name = request.POST.get('collection')
    index = request.POST.get('index')
    
    email = User.objects.get(username=username).email
    try:
        status = indexpermissionmodel.objects.get(email=email, index_name=index, collection_name=collection_name).status
        
        if status == True:
            indexpermissionmodel.objects.filter(email=email, index_name=index, collection_name=collection_name).update(status=False)
        else:
            indexpermissionmodel.objects.filter(email=email, index_name=index, collection_name=collection_name).update(status=True)
    except:
        indexpermissionmodel.objects.create(email=email, index_name=index, collection_name=collection_name, status=True).save()
        
    return JsonResponse({"success": "ok"})

def check_admin(email):
    status = False

    if User.objects.get(email=email).is_staff:
        status = True

    return status
@login_required(login_url="/accounts/signin/")
def index(request):
    email = request.user.email

    index_list = []
    indexes = indexmodel.objects.all()

    for index in indexes:
        index_list.append(index.index_name)
    # index_list = pinecone.list_indexes()
    try:
        selected_index = index_list[0]
    except:
        selected_index = ""

    collections = []
    documents = []

    collection_list = collection.objects.filter(index_name = selected_index)
    document_list = filemodel.objects.filter(index_name = selected_index)

    for col in collection_list:
        collections.append({'id': col.id, 'name': col.collection_name})

    for doc in document_list:
        filename = doc.file_name[:-4]
        if len(filename) > 24:
            filename = filename[:24] + "..."
        documents.append({'id': doc.id, 'index':index, 'collection': doc.collection_name, 'name': filename, 'created_at': doc.created_at, 'size': doc.size})
    

    eindex_list = index_list[1:]
    data = {'collections': collections, 'documents': documents, "index_list": eindex_list, "selected_index": selected_index, 'aindex_list': index_list, 'is_admin': check_admin(email)}

    return render(request, 'index_config.html', data)

@login_required(login_url="/accounts/signin/")
def prompt(request):
    email = request.user.email
    data = []
    prompts = promptmodel.objects.filter(email = email)
    for prompt in prompts:
        data.append({"id": prompt.id, "title": prompt.title, "prompt": prompt.prompt, "is_admin": check_admin(email)})
        
    return render(request, 'prompt_config.html', {"prompts": data})

def documentation(request):
    email = request.user.email
    return render(request, 'documentation.html', {"is_admin": check_admin(email)})

def faq(request):
    email = request.user.email
    return render(request, 'faq.html', {"is_admin": check_admin(email)})

def contact(request):
    email = request.user.email
    return render(request, 'contact.html', {"is_admin": check_admin(email)})

@login_required(login_url="/accounts/signin/")
def accounts(request):
    email = request.user.email
    result = []
    users = User.objects.all()
    for user in users:
        status = False
        if user.is_staff:
            status = True
        result.append({'id': user.id, 'username': user.username, 'email': user.email, 'admin': status})

    data = {"success": "ok", "data": result, "is_admin":check_admin(email)}
    return render(request, 'accounts.html', data)

def signin(request):
    if request.method == "GET":
        return render(request, 'sign-in.html')
    elif request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', '/')
            return HttpResponseRedirect(next_url)
        else:
            return HttpResponseRedirect(reverse('signin'))

def signup(request):
    if request.method == "GET":
        return render(request, 'sign-up.html')
    elif request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).count() > 0 or User.objects.filter(email=email).count() > 0:
            return HttpResponseRedirect(reverse('signup'))
        else:
            User.objects.create_user(username, email, password)
            return HttpResponseRedirect(reverse('accounts'))

@login_required(login_url="/accounts/signin/")
def signout(request):
    logout(request)
    return HttpResponseRedirect(reverse('signin'))


def addPrompt(request):
    if request.method == "POST":
        email = request.user.email
        title = request.POST.get("title")
        prompt = request.POST.get("prompt")
    
    
        if promptmodel.objects.filter(email=email, title=title).count() == 0:
            record = promptmodel.objects.create(email=email, prompt=prompt, title=title)
            record.save()
            data = {"success": "ok", "id": record.id}
        
        else:
            data = {"success": "bad"}

        return JsonResponse(data)

def updatePrompt(request):
    if request.method == "POST":
        id = request.POST.get('id')
        title = request.POST.get("title")
        prompt = request.POST.get("prompt")

        origin_title = promptmodel.objects.get(id=id).title

        promptpermissionmodel.objects.filter(value=origin_title).update(value=title)
        promptmodel.objects.filter(id = id).update(title = title, prompt = prompt)

    data = {"success": "ok", "data": "lkskdfjalskd"}
    return JsonResponse(data)

def deletePrompt(request):
    if request.method == "POST":
        id = request.POST.get('id')
        title = promptmodel.objects.get(id=id).title
        promptmodel.objects.filter(id = id).delete()
        promptpermissionmodel.objects.filter(value=title).delete()

    data = {"success": "ok", "data": "lkskdfjalskd"}
    return JsonResponse(data)

def getCollectionList(request):
    index = request.POST.get('id')
    email = request.user.email
    collection_lists = []
    
    results = indexpermissionmodel.objects.filter(index_name = index, email=email, status=True)
    if results:
        for result in results:
            collection_lists.append({'name': result.collection_name})
    
    show_collection_select = False
    if len(collection_lists) > 1:
        show_collection_select = True

    data = {"success": "ok", "data": collection_lists, "show_collection_select": show_collection_select}
    return JsonResponse(data)

def query(request):
    index = request.POST.get('index')
    document = request.POST.get('collection')
    model = request.POST.get('model')
    temperature = float(request.POST.get('temperature'))
    temperature = 0.1
    top_k = int(request.POST.get('nov'))
    prompt_title = request.POST.get('prompt')

    query = request.POST.get('message')
    new_chat = request.POST.get('new_chat')
 
    # doc_mode = request.POST.get('doc_mode')
    doc_mode = "stuff"
    
    print(model)
    embedding_model = indexmodel.objects.get(index_name=index).model

    print(embedding_model)

    prompt_content = promptmodel.objects.get(title = prompt_title).prompt
    # prompt_content = "Plz generate answer."
    template = """"""
        
    end = """Context: {context}
    Chat history: {chat_history}
    Human: {human_input}
    Your Response as Chatbot:"""
    
    template += prompt_content + end
    
    prompt = PromptTemplate(
        input_variables=["chat_history", "human_input", "context"],
        template=template
    )
    
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="human_input")

    embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key, model=embedding_model)
    
    docsearch = PineconeVectorStore.from_existing_index(
               index_name = index, embedding = embeddings)
    condition = {"collection_name": document}
    
    print(condition)
    docss = docsearch.similarity_search(query, k=top_k, filter = condition)

    # print(docs[0], "\n\n\n\n")

    file_list = []
    for doc in docss:
        if not doc.metadata['file_path'] in file_list:
            file_list.append(doc.metadata['file_path'])
    
    docs = []
    
    for file in file_list:
        loader = PyMuPDFLoader(f"uploads/{file}")
        data = loader.load()
        docs.extend(data)

    print(docs)
    if "gpt" in model:
        llm = ChatOpenAI(temperature=temperature, model=model, openai_api_key=openai_api_key, streaming=True)
    elif model == "togethercomputer/llama-2-70b-chat" or model == "lmsys/vicuna-13b-v1.5":
        llm = Together(model=model, temperature=temperature, max_tokens=1024, top_k=1, together_api_key=together_api_key)
    elif "sonnet" or "haiku" in model:
        llm = Sonnet(model_id="anthropic.claude-3-sonnet-20240229-v1:0", model_kwargs={"temperature": 0.1})
    else:
        llm = BedrockChat(model_id=model, model_kwargs={"temperature": float(temperature)})

    token_num = 0
    for doc in docs:
        token_num += llm.get_num_tokens(doc.page_content)
    token_num += llm.get_num_tokens(query)
    
    stuff_chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt, memory=memory)
    reduce_chain = load_qa_chain(llm, chain_type="map_reduce", return_intermediate_steps=False, question_prompt=prompt, memory=memory)
    
    reduce_chat_history = ""
    latest_records = buffermodel.objects.order_by('-created_at')

    if new_chat == "false":
        for index, record in enumerate(latest_records):
            if index < 4:
                print("Query => ", record.query)
                print("Answer => ", record.answer)
                stuff_chain.memory.save_context({'human_input': record.query}, {'output': record.answer})
                reduce_chat_history += f"Human: {record.query}\nBot: {record.answer}\n"
                reduce_chain.memory.save_context({'human_input': record.query}, {'output': record.answer})
            else:
                record.delete()
    else:
        for index, record in enumerate(latest_records):
            record.delete()
    
    # print("Memory", stuff_chain.memory, "\n\n")
    
    if doc_mode == "stuff":
        output = stuff_chain({"input_documents": docs, "human_input": query}, return_only_outputs=False)
        
        buffer = buffermodel()
        buffer.query = query
        buffer.answer = output["output_text"]
        buffer.save()

        stuff_chain.memory.clear()
        g_token = llm.get_num_tokens(output['output_text'])
        final_answer = output["output_text"]
        other_info = f"\n\nInput Tokens {token_num}. Generated Tokens {g_token}." 
    else:
        reduce_res = reduce_chain({"input_documents": docs, "human_input": query, "question": query}, return_only_outputs=True)
        g_token = llm.get_num_tokens(reduce_res['output_text'])
        final_answer = reduce_res["output_text"]
        other_info = f"\n\nInput Tokens {token_num}. Generated Tokens {g_token}." 
        buffer = buffermodel()
        buffer.query = query
        buffer.answer = reduce_res["output_text"]
        buffer.save()
        reduce_chain.memory.clear()
    
    return StreamingHttpResponse(generate(final_answer, other_info))
    # return JsonResponse({"success": "ok", "response": final_answer, "info": other_info})

def generate(final_answer, other_info):
    string = final_answer + other_info
    for character in string:
        yield character
        time.sleep(0.005)

def getDocuments(request):
    index = request.POST.get('index')
    
    collection_list = collection.objects.filter(index_name = index)
    document_list = filemodel.objects.filter(index_name = index)
    
    collections = []
    documents = []
    
    for col in collection_list:
        collections.append({'id': col.id, 'name': col.collection_name})
    
    for doc in document_list:
        filename = doc.file_name[:-4]
        if len(filename) > 24:
            filename = filename[:24] + "..."
        documents.append({'id': doc.id, 'index': 'index-1', 'collection': doc.collection_name, 'name': filename, 'created_at': doc.created_at, 'size': doc.size})
    
    data = {'collections': collections, 'documents': documents}
    
    # data = {
    #     'collections': [
    #         {'id': "1", 'name': "collection-1"},
    #         {'id': "2", 'name': "collection-2"},
    #         {'id': "3", 'name': "collection-3"},
    #         {'id': "4", 'name': "collection-4"},
    #         {'id': "5", 'name': "collection-5"},
    #     ],
    #     'documents': [
    #         {'id': "1", 'index': "index-1", 'collection': "collection-1", 'name': "document-1", 'author': "admin", 'size': "2M",  'created_at': "2013-05-01"},
    #         {'id': "2", 'index': "index-1", 'collection': "collection-1", 'name': "document-2", 'author': "admin", 'size': "25M", 'created_at': "2013-05-01"},
    #         {'id': "3", 'index': "index-1", 'collection': "collection-2", 'name': "document-3", 'author': "admin", 'size': "25M", 'created_at': "2013-05-01"},
    #         {'id': "4", 'index': "index-1", 'collection': "collection-2", 'name': "document-4", 'author': "admin", 'size': "15M", 'created_at': "2013-05-01"},
    #         {'id': "5", 'index': "index-1", 'collection': "collection-3", 'name': "document-5", 'author': "admin", 'size': "25M", 'created_at': "2013-05-01"},
    #     ],
    # }
    data = {"success": "ok", "data": data}
    return JsonResponse(data)


def createIndex(request):
    index_name = request.POST.get('index_name')
    model = request.POST.get('model')

    dimension = 1536
    if model == "text-embedding-3-large":
        dimension = 3072
    try:
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-west-2"
            )
        )

        indexmodel(index_name=index_name, model=model).save()
    except:
        pass

    return JsonResponse({"success": "ok"})

def deleteIndex(request):
    index_name = request.POST.get('index_name')
    if index_name in pc.list_indexes().names():
        pc.delete_index(index_name)

    indexmodel.objects.filter(index_name=index_name).delete()
    collection.objects.filter(index_name=index_name).delete()
    filemodel.objects.filter(index_name=index_name).delete()
    indexpermissionmodel.objects.filter(index_name=index_name).delete()
    
    return JsonResponse({"success": "ok"})

def updateCollection(request):
    chunk_size = request.POST.get('chunk')
    overlap = request.POST.get('overlap')
    collection_name = request.POST.get('collection')
    index_name = request.POST.get('index_name')

    collection.objects.create(index_name=index_name, collection_name=collection_name, chunk_size=chunk_size, overlap=overlap)
        
    data = {"success": "ok"}
    return JsonResponse(data)

def uploadDocuments(request):
    if request.method == 'POST' and request.FILES:
        files = request.FILES.getlist('files[]')
        
        index_name = request.POST['index']
        id = request.POST['collection']
        # metas= request.POST['metas']
        collection_name = collection.objects.get(id=int(id), index_name=index_name).collection_name
        
        print(index_name)
        print(collection_name)

        embedding_model = indexmodel.objects.get(index_name=index_name).model

        for my_file in files:
            real_filename = my_file.name
            uploaded_filename = str(uuid.uuid4()) + os.path.splitext(my_file.name)[1]
            my_file.name = uploaded_filename
            
            upload_model = filemodel()
            upload_model.file = my_file
            upload_model.index_name = index_name
            upload_model.file_name = real_filename
            upload_model.uploaded_name = uploaded_filename
            upload_model.collection_name = collection_name

                    
            coll_set = collection.objects.get(collection_name=collection_name, index_name=index_name)
        
            text_splitter = CharacterTextSplitter(
                separator = "\n", chunk_size=coll_set.chunk_size, chunk_overlap=coll_set.overlap, length_function = len,
            )
            
            try:
                upload_model.save()
                
                file = os.path.join("uploads", my_file.name)
                if file.endswith("pdf"):
                    loader = PyMuPDFLoader(file)
                elif file.endswith("txt"):
                    loader = TextLoader(file, encoding='utf-8')
                    
                data = loader.load()
                texts = text_splitter.split_documents(data)
                all_texts = []
                all_texts.extend(texts)
                
                res = filemodel.objects.get(uploaded_name = uploaded_filename)
                res.size = len(all_texts)
                res.save()
                
                embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key, model=embedding_model)
                
                for text in texts:
                    text.metadata['collection_name'] = collection_name
                    text.metadata['file_name'] = real_filename

                # PineconeVectorStore.from_documents(texts, embeddings, index_name=index_name)
                p_index = pc.Index(index_name)
                    
                vectors = []
                for order, text in enumerate(all_texts):
                    id = f"{uploaded_filename}-{order}"
                    metadata = {"collection_name": collection_name, "file_name": real_filename, "text": text.page_content, "file_path": uploaded_filename}

                    s_vector = {}
                    s_vector["id"] = id
                    s_vector['values'] = embeddings.embed_query(text.page_content)
                    s_vector['metadata'] = metadata
                    
                    vectors.append(s_vector)

                p_index.upsert(vectors=vectors)
                # os.remove(file)
                
                data = {"success": "ok"}
                print("Good")
                
            except Exception as e:
                data = {"success": "bad"}
                print("Bad")
                
        return JsonResponse(data)
    
def addCollection(request):
    data = {"success": "ok", "data": {"id": "new", "name": "New Collection"}}
    return JsonResponse(data)

def deleteCollection(request):
    id = request.POST.get('id')
    print(id)
    if id == "new":
        data = {"success": "ok"}
        return JsonResponse(data)
    
    index_name = request.POST.get('index')
    print(index_name)
    collection_name = collection.objects.get(index_name=index_name, id=int(id)).collection_name
    
    collection.objects.filter(index_name=index_name, id=int(id)).delete()
    filemodel.objects.filter(index_name=index_name, collection_name=collection_name).delete()
    
    index = pc.Index(index_name)
    filter_con = {"collection_name": collection_name}
    try:
        index.delete(filter=filter_con)
    except:
        pass
    data = {"success": "ok"}
    return JsonResponse(data)

def deleteDocuments(request):
    data = request.POST.get('ids')
    doc_ids = json.loads(data)

    for doc_id in doc_ids:
        
        record = filemodel.objects.get(id=doc_id)
        index_name = record.index_name
        collection_name = record.collection_name
        file_name = record.file_name
        uploaded_name = record.uploaded_name
        size = record.size

        index = pc.Index(index_name)
        id_list = []

        for i in range(0, size):
            id_list.append(f"{uploaded_name}-{i}")
        
        index.delete(ids=id_list)
        
        filemodel.objects.filter(id=doc_id).delete()
    
       
        
    data = {"success": "ok"}
    return JsonResponse(data)

def changeUserAuth(request):
    if request.method == "POST":
        id = request.POST.get("id")
        status = request.POST.get("status")

        if status == "true":
            User.objects.filter(id=id).update(is_staff=True)
        else:
            User.objects.filter(id=id).update(is_staff=False)
            
        data = {"success": "ok"}
        return JsonResponse(data)