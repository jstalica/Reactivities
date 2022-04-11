using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public ICollection<Photo> Photos { get; set; }
        // When a logged in user looks at another user's profile this is true if that target user is following the logged in user
        public bool Following { get; set; }
        public int FollowersCount { get; set; }
        public int FollowingCount { get; set; }

        public override string ToString()
        {
            return "Username: " + Username + " Displayname: " + DisplayName + " Bio: "+ Bio + " Image: " + Image;
        }

    }
}