using aisearch.DataContext;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aisearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly AisearchDbContext db;

        public ChatbotController(AisearchDbContext db)
        {
            this.db = db;
        }


        [HttpGet]
        public async Task<ActionResult> GetUser([FromQuery] string name)
        {
            try
            {
                var result = await db.rule
                    .Where(p => p.Name.Contains(name))
                    .Select(p => new
                    {
                        Name = p.Name,
                        Description = p.Description, // Ensure this is returned properly
                        Time = DateTime.Now.ToString("hh:mm:ss tt")
                    })
                    .ToListAsync();

                if (result.Count == 0)
                {
                    return Ok(new { Description = "No relevant answer found." });
                }

                return Ok(result);
            }
            catch (Exception err)
            {
                return StatusCode(500, new { message = "An error occurred while fetching users.", error = err.Message });
            }
        }

    }

}
