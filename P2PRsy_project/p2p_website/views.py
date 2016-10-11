from django.shortcuts import render


def index(request):
    return render(request, 'p2p_website/index.html')

def user_info(request):
    return render(request, 'p2p_website/user_info.html')

def loan_info(request):
    return render(request, 'p2p_website/loan_info.html')
