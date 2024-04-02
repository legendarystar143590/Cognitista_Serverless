from django.urls import path
from django.contrib.auth import views as auth_views


from . import views

urlpatterns = [
    # Pages
    path('', views.home, name="home"),
    path('chatbot', views.chatbot, name="chatbot"),
    path('index', views.index, name="index"),
    path('prompt', views.prompt, name="prompt"),
    path('accounts', views.accounts, name="accounts"),
    path('documentation', views.documentation, name="documentation"),
    path('faq', views.faq, name="faq"),
    path('contact', views.contact, name="contact"),
    path('permission', views.permission, name="permission"),
    # Functions
    path('addPrompt', views.addPrompt, name="addPrompt"),
    path('updatePrompt', views.updatePrompt, name="updatePrompt"),
    path('deletePrompt', views.deletePrompt, name="deletePrompt"),
    path('getCollectionList', views.getCollectionList, name="getCollectionList"),
    path('query', views.query, name="query"),
    path('getDocuments', views.getDocuments, name="getDocuments"),
    path('updateCollection', views.updateCollection, name="updateCollection"),
    path('uploadDocuments', views.uploadDocuments, name="uploadDocuments"),
    path('addCollection', views.addCollection, name="addCollection"),
    path('deleteCollection', views.deleteCollection, name="deleteCollection"),
    path('deleteDocuments', views.deleteDocuments, name="deleteDocuments"),
    path('changeUserAuth', views.changeUserAuth, name="changeUserAuth"),
    path('createIndex', views.createIndex, name="createIndex"),
    path('deleteIndex', views.deleteIndex, name="deleteIndex"),
    path('getpermissioninfo', views.getpermissioninfo, name="getpermissioninfo"),
    path('setllmpermission', views.setllmpermission, name="setllmpermission"),
    path('setcollectionpermission', views.setcollectionpermission, name="setcollectionpermission"),
    path('setpromptpermission', views.setpromptpermission, name="setpromptpermission"),
    path('setadminpermission', views.setadminpermission, name="setadminpermission"),
    path('setvectorpermission', views.setvectorpermission, name="setvectorpermission"),
    # Authentication
    path("accounts/signout/", views.signout, name="signout"),
    path("accounts/signin/", views.signin, name="signin"),
    path("accounts/signup/", views.signup, name="signup"),
]