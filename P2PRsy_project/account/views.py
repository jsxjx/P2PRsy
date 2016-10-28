from django.shortcuts import render

from django.http import HttpResponseRedirect

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.core.urlresolvers import reverse

from account.forms import UserForm

def register(request):
    registered = False
    if request.method == "POST":
        user_form = UserForm(data=request.POST)

        if user_form.is_valid():
            user = user_form.save(commit=False)
            user.set_password(user.password)
            user.save()
            registered = True
        else:
            print user_form.errors
    else:
        user_form = UserForm()

    return render(request,
                  'account/register.html',
                  {'registered': registered,
                   'user_form': user_form,})

def user_login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(reverse('p2p_website:index'))
            else:
                return HttpResponse("Your Account is disabled.")
        else:
            print "Invalid login details: {0}, {1}".format(username, password)
            return render(request, 'account/login.html', {})
    else:
        return render(request, 'account/login.html', {})


@login_required
def user_logout(request):
    logout(request)
    print(request.get_full_path())
    return HttpResponseRedirect(reverse('p2p_website:index'))
