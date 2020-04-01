using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class IAChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "conceptName",
                table: "IdeationAnswers");

            migrationBuilder.AddColumn<int>(
                name: "cid",
                table: "IdeationAnswers",
                unicode: false,
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "cid",
                table: "IdeationAnswers");

            migrationBuilder.AddColumn<string>(
                name: "conceptName",
                table: "IdeationAnswers",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
