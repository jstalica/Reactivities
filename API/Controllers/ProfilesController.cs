using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseAPIController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPut]
        public async Task<IActionResult> SetProfile(Profile profile)
        {
            return HandleResult(await Mediator.Send(new Edit.Command{Profile=profile}));
        }

        [HttpGet("{username}/events")]
        public async Task<IActionResult> GetProfileEvents(string username, [FromQuery]ProfileEventsParams param)
        {
            return HandlePagedResult(await Mediator.Send(new ProfileEventsDetails.Query{Username=username, Params=param}));
        }
    }
}