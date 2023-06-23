from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class PorfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='abc', password='somepassword')
        self.userb = User.objects.create_user(username='abc-2', password='somepassword2')
    
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