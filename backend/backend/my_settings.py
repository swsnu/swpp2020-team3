# Email settings
EMAIL = {
'EMAIL_BACKEND' : 'django.core.mail.backends.smtp.EmailBackend',
'EMAIL_USE_TLS' : True,
'EMAIL_PORT' : 587,
'EMAIL_HOST' : 'smtp.gmail.com',   
'EMAIL_HOST_USER' : 'swppsend@gmail.com',                    
'EMAIL_HOST_PASSWORD' : 'swpp2020',
'REDIRECT_PAGE' : 'http://10.58.5.40:3000/signin'
}