using System.Data;
using aisearch.DataContext;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace aisearch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RuleController : ControllerBase
    {
        private readonly AisearchDbContext db;

        public RuleController(AisearchDbContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult> GetUser()
        {
            try
            {
                var result = await db.rule.ToListAsync();

                return Ok(result);
            }
            catch (Exception err)
            {
                return StatusCode(500, new { message = "An error occured while fetching users.", error = err.Message });
            }
        }
    }
}
