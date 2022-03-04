using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        // "(?=.*\\d)(?=.*\\[a-z])(?=.*\\[A-Z]).{4,8}$" digit, upper, lower
        [RegularExpression("(?=.*[A-Z])(?=.*[a-z]).{4,8}$",ErrorMessage = "Password must contain at least one upper case letter, one lower case letter, and be between 4 and 8 characters long.")]
        public string Password { get; set; }
        [Required]
        public string Username { get; set; }
    }
}