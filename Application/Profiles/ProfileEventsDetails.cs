using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class ProfileEventsDetails
    {
        public class Query : IRequest<Result<PagedList<UserActivityDto>>>
        {
            public ProfileEventsParams Params { get; set; }
            public string Username { get; set; }

            public class Handler : IRequestHandler<Query, Result<PagedList<UserActivityDto>>>
            {
                private readonly DataContext _context;
                private readonly IUserAccessor _userAccessor;
                private readonly IMapper _mapper;
                public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
                {
                    _mapper = mapper;
                    _userAccessor = userAccessor;
                    _context = context;
                }

                public async Task<Result<PagedList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
                {
                    var user = _userAccessor.GetUserName();

                    var query =  _context.Activities
                        // Profile being viewed user is an attendee
                        .Where(a => a.Attendees.Any(a => a.AppUser.UserName == request.Username))
                        .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUserName()})
                        .AsQueryable();

                    if(request.Params.IsFuture)
                    {
                        query = query
                            // today or after
                            .Where(d => d.Date >= DateTime.UtcNow)
                            // Order by soonest event
                            .OrderBy(d => d.Date);
                    }
                    else if(request.Params.IsPast)
                    {
                        query = query
                            // Before today
                            .Where(d => d.Date < DateTime.UtcNow)
                            // Order by most recent event
                            .OrderByDescending(d => d.Date);
                    }
                    else if(request.Params.IsHosting)
                    {
                        // The profile being viewed user is the host
                        query = query
                            // User is host
                            .Where(x => x.HostUsername == request.Username)
                            // Order by most recent
                            .OrderByDescending(d => d.Date);
                    }
                    else
                    {
                        query = query
                            // Order by most recent
                            .OrderByDescending(d => d.Date);
                    }

                    return Result<PagedList<UserActivityDto>>.Success(
                        await PagedList<UserActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                    );


                    throw new Exception();

                }
            }
        }
    }
}