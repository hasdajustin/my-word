from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from .models import Post
from .serializers import PostSerializer
from rest_framework.response import Response
from django.contrib.auth.models import User

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    lookup_field = 'slug'

    def perform_create(self, serializer):
        author = User.objects.first() 
        serializer.save(author=author)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
