from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework.test import APIClient

# Create your tests here.
from .models import Profile

User = get_user_model()

class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='abc', password='somepassword')
        self.userb = User.objects.create_user(username='abc-2', password='somepassword2')

    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password='somepassword')
        return client
    
    def test_profile_created_via_signal(self):
        qs = Profile.objects.all()
        self.assertEqual(qs.count(), 2) #should be a profile for each user created

    def test_following(self):
        first = self.user
        second = self.userb
        first.profile.followers.add(second) #making second user follow first user
        qs = second.following.filter(user=first) #filtering to find if second user has an instance of following first user
        self.assertTrue(qs.exists())
        first_user_following = first.following.all()
        self.assertFalse(first_user_following.exists()) #shouldnt have any instances of following anyone

    def test_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(
            f"/api/profile/{self.userb.username}/follow",
            {"action":"follow"}
            )
        r_data = response.json()
        count = r_data.get("count")
        self.assertEqual(count, 1) #should have 1 follower (person who just followed)

    def test_unfollow_api_endpoint(self):
        first = self.user
        second = self.userb
        first.profile.followers.add(second)

        client = self.get_client()
        response = client.post(
            f"/api/profile/{self.userb.username}/follow",
            {"action":"unfollow"}
            )
        r_data = response.json()
        count = r_data.get("count")
        self.assertEqual(count, 0) #should have no followers (person who was following just unfollowed)

    def test_cannot_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(
            f"/api/profile/{self.user.username}/follow", #trying to follow themself (abc following abc)
            {"action":"follow"}
            )
        r_data = response.json()
        count = r_data.get("count")
        self.assertEqual(count, 0) #should have 0 followers (didn't let user follow themself)