using System;
namespace MindOverMapper_Movim.Models
{
    public partial class DeleteFileRequest
    {
      public string FileName { get; set; }
      public int ProjectId { get; set; }
    }
}
