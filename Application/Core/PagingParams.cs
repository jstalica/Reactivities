using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MAXPAGESIZE = 50;
        private const int DEFAULTPAGESIZE = 10;

        public int PageNumber { get; set; } = 1;

        private int _pageSize = DEFAULTPAGESIZE;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MAXPAGESIZE) ? MAXPAGESIZE : value;
        }
        
    }
}