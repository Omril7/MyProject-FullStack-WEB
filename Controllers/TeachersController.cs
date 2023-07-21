using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.DependencyResolver;
using TelHai.FullStackWEB.Models;

namespace TelHai.FullStackWEB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly TeacherContext _context;

        public TeachersController(TeacherContext context)
        {
            _context = context;
        }

        /*
         * 
         * Teachers
         *
         */

        // GET: api/Teachers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Teacher>>> GetTeachers()
        {
          if (_context.Teachers == null)
          {
              return NotFound();
          }
            return await _context.Teachers.ToListAsync();
        }

        // GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Teacher>> GetTeacher(int id)
        {
          if (_context.Teachers == null)
          {
              return NotFound();
          }
            var teacher = await _context.Teachers.Include(t => t.Exams)
                                                 .ThenInclude(e => e.Questions)
                                                 .ThenInclude(q => q.Answers)
                                                 .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher;
        }

        // PUT: api/Teachers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, Teacher teacher)
        {
            if (id != teacher.Id)
            {
                return BadRequest();
            }

            _context.Entry(teacher).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Teachers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Teacher>> PostTeacher(Teacher teacher)
        {
            if (_context.Teachers == null)
            {
                return Problem("Entity set 'TeacherContext.Teachers'  is null.");
            }
            //if (TeacherExists(teacher.Id))
            //{
            //    _context.Teachers.Remove(teacher);
            //}
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeacher", new { id = teacher.Id }, teacher);
        }

        // DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            if (_context.Teachers == null)
            {
                return NotFound();
            }
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /*
         * 
         * Exams
         *
         */

        // GET: api/Teachers/{id}/Exams
        [HttpGet("{id}/Exams")]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExams(int id)
        {
            if (_context.Teachers == null)
            {
                return NotFound();
            }
            var teacher = await _context.Teachers.Include(t => t.Exams)
                                                 .ThenInclude(e => e.Questions)
                                                 .ThenInclude(q => q.Answers)
                                                 .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null)
            {
                return NotFound();
            }

            return teacher.Exams;
        }

        // POST: api/Teachers/{id}/Exams
        [HttpPost("{id}/Exams")]
        public async Task<ActionResult<Exam>> PostExam(int id, Exam exam)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound();
            }
            teacher.Exams.Add(exam);

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExam", new { id = exam.Id }, exam);
        }

        // PUT: api/Teachers/{id}/Exams/{examId}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}/Exams/{examId}")]
        public async Task<IActionResult> PutExam(int id, Exam exam, int examId)
        {
            if (examId != exam.Id)
            {
                return BadRequest();
            }
            // _context.Entry(exam).State = EntityState.Modified;
            Exam? DBexam = _context.Exams.Include(e => e.Questions)
                                         .ThenInclude(q => q.Answers)
                                         .FirstOrDefault(e => e.Id == examId);
            if (DBexam == null)
            {
                return NotFound();
            }
            DBexam.Update(exam);

            // Maybe do it with LINQ
            var toAdd = new List<Question>();
            var toDel = new List<Question>();
            for (int i=0; i<DBexam.Questions.Count; i++)
            {
                bool found = false;
                foreach(var question in exam.Questions)
                {
                    if (DBexam.Questions[i].Id == question.Id)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    toDel.Add(DBexam.Questions[i]);
                }
            }

            for (int i=0; i<exam.Questions.Count; i++)
            {
                if (exam.Questions[i].Id == 0)
                {
                    toAdd.Add(exam.Questions[i]);
                }
            }
            for (int i=0; i<toAdd.Count; i++)
            {
                DBexam.Questions.Add(toAdd[i]);
                _context.Questions.Add(toAdd[i]);
            }

            for (int i = 0; i < toDel.Count; i++)
            {
                DBexam.Questions.Remove(toDel[i]);
                _context.Questions.Remove(toDel[i]);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Teachers/{id}/Exams/{examId}
        [HttpDelete("{id}/Exams/{examId}")]
        public async Task<IActionResult> DeleteExam(int id, int examId)
        {
            var teacher = await _context.Teachers.Include(t => t.Exams).FirstOrDefaultAsync(t => t.Id == id);
            if (teacher == null)
            {
                return NotFound();
            }

            var exam = teacher.Exams.FirstOrDefault(e => e.Id == examId);
            if (exam == null)
            {
                return NotFound();
            }

            teacher.Exams.Remove(exam);
            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherExists(int id)
        {
            return (_context.Teachers?.Any(t => t.Id == id)).GetValueOrDefault();
        }
    }
}
