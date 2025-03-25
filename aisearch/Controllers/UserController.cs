using Domain.Dtos;
using Domain.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using aisearch.DataContext;
using Microsoft.EntityFrameworkCore;

namespace aisearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class UserController : ControllerBase
    {
        private readonly AisearchDbContext db;
        private readonly IConfiguration configuration;
        private readonly ILogger<UserController> logger;

        public UserController(AisearchDbContext db, IConfiguration configuration,ILogger<UserController> logger)
        {
            this.db = db;
            this.configuration = configuration;
            this.logger = logger;
        }
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            try
            {
              
                logger.LogInformation("Get all User Correctly");
                var result = await db.user
                .Include(u => u.role)
                .Where(u => u.role != null) // Ensures no null reference issues
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Place,
                    RoleName = u.role.Name
                })
                 .ToListAsync();

                return Ok(result);
            }
            catch (Exception err)
            {
                logger.LogError(err, "Get Users has an Error: {Message}", err.Message);
                return StatusCode(500, new { message = "An error occurred while fetching users.", error = err.ToString() });
            }

        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            try
            {
                var user = await db.user.FindAsync(id);
                if (user == null) return NotFound(new {message="Users not found"});
                return Ok(user);
            }
            catch(Exception err)
            {
                logger.LogError("Get Users by Id has an Error");
                return StatusCode(500, new { message = "An error occured while fetching users.", error = err.Message });
            }
        }


        [AllowAnonymous]

        [HttpGet("{email}/{password}")]
        public async Task<ActionResult<User>> Login(string email, string password)
        {
            var result = new LoginResponseDto();

            var user = await db.user.FirstOrDefaultAsync(p => p.Email == email && p.Password == password);
            if (user == null)
            {
                return NotFound();
            }
            else
            {
                result.Name = user.Name;
                result.RoleId = user.RoleId;
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Name, email)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    configuration["Jwt:Issuer"],
                    configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(30),
                    signingCredentials: creds
                );
                result.Token = new JwtSecurityTokenHandler().WriteToken(token);
            }

            return Ok(result);
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> PostRole(UserRequestDto userRequestDto)
        {
            try
            {
                var newUser = new User()
                {
                    Name = userRequestDto.Name,
                    Email = userRequestDto.Email,
                    Password = userRequestDto.Password,
                    Place = userRequestDto.Place,
                    RoleId = userRequestDto.RoleId,
                };
                db.user.Add(newUser);
                await db.SaveChangesAsync();
                return Ok(newUser);
            }
            catch(Exception err)
            {
                logger.LogError("Created User has an Error");
                return StatusCode(500, new { message = "An error occured while creating the users", error = err.Message });
            }
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserRequestDto userRequestDto)
        {
            try { 
            var existingUser = await db.user.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound(new { message = "User not found" });
            }
            existingUser.Name = userRequestDto.Name;
            existingUser.Email = userRequestDto.Email;
            existingUser.Password = userRequestDto.Password;
            existingUser.Place = userRequestDto.Place;
            existingUser.RoleId = userRequestDto.RoleId;
            await db.SaveChangesAsync();
            return Ok(new { message = "User updated successfully", user = existingUser });
            }
            catch (Exception ex)
            {
                logger.LogError("Get Users has an Error");
                return StatusCode(500, new { message = "An error occurred while updating the user", error = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<IEnumerable<User>>> DeleteUser(int id)
        {
            try
            {
                var delete = await db.user.FindAsync(id);
                db.user.Remove(delete);
                await db.SaveChangesAsync();
                return Ok(delete);
            }
            catch(Exception err)
            {
                logger.LogError("Remove Users has an Error");
                return StatusCode(500, new { message = "An error occured while deleting the user", error = err.Message });
            }
        }
        [AllowAnonymous]

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<User>>> SearchUsers([FromQuery] string search)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return BadRequest("Search term cannot be empty.");
            }

            try
            {
                var users = await db.user
                    .Include(u => u.role)
                    .Where(u => u.Name.Contains(search) || u.Email.Contains(search) || u.Place.Contains(search))
                    .Select(u => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        u.Place,
                        RoleName = u.role.Name
                    })
                    .ToListAsync();

                if (users.Count == 0)
                {
                    return NotFound("No users found.");
                }

                return Ok(users);
            }
            catch (Exception ex)
            {
                logger.LogError("Search any Users has an Error");
                return StatusCode(500, $"An error occurred while searching for users: {ex.Message}");
            }
        }



    }
}
