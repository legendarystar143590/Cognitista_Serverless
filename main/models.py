from django.db import models

# Create your models here.
class config(models.Model):
    openai_api_key = models.CharField(max_length=60)
    pinecone_api_key = models.CharField(max_length=50)
    pinecone_env = models.CharField(max_length=50)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

class collection(models.Model):
    index_name = models.CharField(max_length=50)
    collection_name = models.CharField(max_length=50)
    chunk_size = models.IntegerField(default=1000)
    overlap = models.IntegerField(default=200)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)


class filemodel(models.Model):
    file = models.FileField(upload_to='uploads/')
    index_name = models.CharField(max_length=50)
    collection_name = models.CharField(max_length=50)
    file_name = models.CharField(max_length=50)
    size = models.IntegerField(default=0)
    created_at = models.DateField(auto_now_add=True)
    uploaded_name = models.CharField(max_length=50)
    
class promptmodel(models.Model):
    email = models.EmailField()
    prompt = models.TextField()
    title = models.CharField(max_length=30, default="default")
    
class buffermodel(models.Model):
    query = models.CharField(max_length=2000)
    answer = models.CharField(max_length=2000)
    created_at = models.DateTimeField(auto_now_add=True)

class indexmodel(models.Model):
    index_name = models.CharField(max_length=50)
    model = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)

class indexpermissionmodel(models.Model):
    email = models.EmailField()
    index_name = models.CharField(max_length=50)
    collection_name = models.CharField(max_length=50)
    status = models.BooleanField(default=False)

class llmpermissionmodel(models.Model):
    email = models.EmailField()
    value = models.CharField(max_length=50)
    status = models.BooleanField(default=False)

class llmmodel(models.Model):
    llm = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    
class promptpermissionmodel(models.Model):
    email = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    status = models.BooleanField(default=False)

class vectormodel(models.Model):
    email = models.EmailField()
    value = models.IntegerField()