using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class QEvolve : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "notes",
                table: "Question",
                unicode: false,
                maxLength: 1000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "notes",
                table: "Question");
        }
    }
}
