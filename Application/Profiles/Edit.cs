using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Profile Profile { get; set; }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.Profile).SetValidator(new ProfileValidator());
                }
            }
            
            public class Handler : IRequestHandler<Command, Result<Unit>>
            {
                private readonly DataContext _context;
                private readonly IMapper _mapper;
                private readonly ILogger _logger;
                private readonly IUserAccessor _userAccessor;

                public Handler(DataContext context, IMapper mapper, ILogger<Profile> logger, IUserAccessor userAccessor)
                {
                    _context = context;
                    _mapper = mapper;
                    _logger = logger;
                    _userAccessor = userAccessor;
                }

                public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
                {
                    _logger.LogInformation("Edit Start");

                    var user = await _context.Users
                        .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());

                    if (user == null) return null;

                    // _logger.LogInformation(request.Profile.ToString());
                    // var userProfile = await _context.Users
                    //     .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    //     .SingleOrDefaultAsync(x => x.Username == request.Profile.Username);

                    // _logger.LogInformation("Username: " + userProfile.Username);

                    user.Bio = request.Profile.Bio;
                    user.DisplayName = request.Profile.DisplayName;

                    // Force Modified?
                    _context.Entry(user).State = EntityState.Modified;

                    var result = await _context.SaveChangesAsync() > 0;

                    if (!result) return Result<Unit>.Failure("Failed to update the profile.");

                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}