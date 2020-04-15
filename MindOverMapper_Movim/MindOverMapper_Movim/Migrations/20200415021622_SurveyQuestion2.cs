using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class SurveyQuestion2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "prototype_id",
                table: "Survey");

            migrationBuilder.AddColumn<string>(
                name: "prototypes",
                table: "Survey",
                type: "nvarchar(4000)",
                unicode: false,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "prototypes",
                table: "Survey");

            migrationBuilder.AddColumn<int>(
                name: "prototype_id",
                table: "Survey",
                nullable: false,
                defaultValue: 0);
        }
    }
}
