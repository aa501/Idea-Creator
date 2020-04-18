using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class Slight1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "surveyTakerId",
                table: "SurveyAnswer");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "SurveyTaker",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "notes",
                table: "SurveyTaker",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "survey_taker_uid",
                table: "SurveyAnswer",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "survey_uid",
                table: "SurveyAnswer",
                unicode: false,
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "SurveyTaker");

            migrationBuilder.DropColumn(
                name: "notes",
                table: "SurveyTaker");

            migrationBuilder.DropColumn(
                name: "survey_taker_uid",
                table: "SurveyAnswer");

            migrationBuilder.DropColumn(
                name: "survey_uid",
                table: "SurveyAnswer");

            migrationBuilder.AddColumn<string>(
                name: "surveyTakerId",
                table: "SurveyAnswer",
                nullable: true);
        }
    }
}
