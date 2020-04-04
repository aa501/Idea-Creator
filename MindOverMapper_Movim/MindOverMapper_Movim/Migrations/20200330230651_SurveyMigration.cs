using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class SurveyMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "Surveys",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    projectId = table.column<int>(nullable: false),
                    name = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    demographics = table.Column<bool>(),
                    price = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    type = table.Column<int>(unicode: false, maxlength: 50, nullable: false),
                    comparison = table.Column<string>(unicode: false, maxLength: 50, nullable: false),
                    idea = table.Column<bool>(),
                    package = table.Column<bool>(),
                    product = table.Column<bool>(),
                    Name = table.Column<bool>(),
                    Frequency = table.Column<bool>(),
                    purchasePrice = table.Column<bool>(),
                    comments = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Surveys", x => x.id);
                }); ;


            migrationBuilder.CreateTable(
                name: "ConceptSurvey",
                columns: table => new
                {
                    id = id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    conceptId = table.Column<int>(unicode: false),
                    surveyId = table.Column<int>(unicode: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Concept_Survey_id", x => x.id);
                });

            migrationBuilder.CreateTable(
               name: "PrototypeSurvey",
               columns: table => new
               {
                   id = id = table.Column<int>(nullable: false)
                       .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                   prototypetId = table.Column<int>(unicode: false),
                   surveyId = table.Column<int>(unicode: false)
               },
               constraints: table =>
               {
                   table.PrimaryKey("PK_Concept_Survey_id", x => x.id);
               });

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.dropTable(
                nameof: "Surveys"
                );
            migrationBuilder.dropTable(
                nameof: "ConceptSurvey"
                );
            migrationBuilder.dropTable(
                nameof: "PrototypeSurvey"
                );
        }
    }
}
