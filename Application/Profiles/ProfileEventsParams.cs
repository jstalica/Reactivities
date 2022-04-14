using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;

namespace Application.Profiles
{
    public class ProfileEventsParams : PagingParams
    {
        public bool IsFuture { get; set; } = false;
        public bool IsPast { get; set; } = false;
        public bool IsHosting { get; set; } = false;
    }
}