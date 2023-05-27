from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework.test import APIClient

from .models import Post, PostComment
# Create your tests here.
User = get_user_model()

class PostTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='abc', password='somepassword')
        self.userb = User.objects.create_user(username='abc-2', password='somepassword2')
        Post.objects.create(content="my first post", user=self.user)
        Post.objects.create(content="my second post", user=self.user)
        Post.objects.create(content="my third post", user=self.userb)
        Post.objects.create(content="my fourth post", user=self.userb)
        self.commentCurrentCount = PostComment.objects.all().count()
        self.postCurrentCount = Post.objects.all().count()
    
    def test_post_created(self):
        post_obj = Post.objects.create(content="my fifth post", user=self.user)
        self.assertEqual(post_obj.id, 5) #testing if the two values are the same, or equal, e.g. self.assertEqual(1, 2) would cause an error as they are not equal
        self.assertEqual(post_obj.user, self.user)

    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='somepassword')
        return client

    def test_post_list(self):
        client = self.get_client()
        response = client.get("/api/posts/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 4)

    def test_action_like(self):
        client = self.get_client()
        response = client.post("/api/posts/action/", {"id": 1, "action": "like"})
        self.assertEqual(response.status_code, 200)
        like_count = response.json().get("likes")
        self.assertEqual(like_count, 1)
        #print(response.json())
        #self.assertEqual(len(response.json()), 4)

    def test_action_unlike(self):
        client = self.get_client()
        response = client.post("/api/posts/action/", {"id": 2, "action": "like"})
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/posts/action/", {"id": 2, "action": "unlike"})
        self.assertEqual(response.status_code, 200)
        like_count = response.json().get("likes")
        self.assertEqual(like_count, 0)
    
    def test_action_comment(self):
        client = self.get_client()
        current_count = self.commentCurrentCount
        response = client.post("/api/posts/action/", {"id": 3, "action": "comment"})
        print(response.json())
        data = response.json().get("comments")[-1] #gets the dictionary containing keys and values of the most recent comment on the post
        new_comment_id = data['id'] #id of the most recent comment on the post
        self.assertEqual(response.status_code, 201)
        self.assertEqual(current_count + 1, new_comment_id) #should have a new id

    def test_post_create_api_view(self):
        request_data = {"content": "This is my test post"}
        client = self.get_client()
        current_count = self.postCurrentCount
        response = client.post("/api/posts/create/", request_data)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        new_post_id = response_data.get("id")
        self.assertEqual(current_count + 1, new_post_id)

    def test_post_detail_api_view(self):
        client = self.get_client()
        response = client.get("/api/posts/1/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        _id = data.get("id")
        self.assertEqual(_id, 1)

    def test_post_delete_api_view(self):
        client = self.get_client()
        response = client.delete("/api/posts/1/delete/")
        self.assertEqual(response.status_code, 200)
        client = self.get_client()
        response = client.delete("/api/posts/1/delete/")
        self.assertEqual(response.status_code, 404)
        response_incorrect_owner = client.delete("/api/posts/3/delete/") #post by different user
        self.assertEqual(response_incorrect_owner.status_code, 401) #401 - unauthorized (post is not theirs to delete)