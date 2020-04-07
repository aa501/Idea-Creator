using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MindOverMapper_Movim.Migrations
{
    public partial class Survey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Survey",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ProjectId = table.Column<int>(nullable: false),
                    SurveyName = table.Column<string>(nullable: true),
                    PricingOptionId = table.Column<int>(nullable: false),
                    Idea = table.Column<bool>(nullable: false),
                    Package = table.Column<bool>(nullable: false),
                    Product = table.Column<bool>(nullable: false),
                    Name = table.Column<bool>(nullable: false),
                    PurchaseFrequency = table.Column<bool>(nullable: false),
                    PurchasePrice = table.Column<bool>(nullable: false),
                    Qualitative = table.Column<bool>(nullable: false),
                    Demographics = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Survey", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConceptSurvey",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ConceptId = table.Column<int>(nullable: false),
                    SurveyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConceptSurvey", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConceptSurvey_Concept_ConceptId",
                        column: x => x.ConceptId,
                        principalTable: "Concept",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConceptSurvey_Survey_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Survey",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PrototypeSurvey",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PrototypeId = table.Column<int>(nullable: false),
                    SurveyId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrototypeSurvey", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrototypeSurvey_Prototype_PrototypeId",
                        column: x => x.PrototypeId,
                        principalTable: "Prototype",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrototypeSurvey_Survey_SurveyId",
                        column: x => x.SurveyId,
                        principalTable: "Survey",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConceptSurvey_ConceptId",
                table: "ConceptSurvey",
                column: "ConceptId");

            migrationBuilder.CreateIndex(
                name: "IX_ConceptSurvey_SurveyId",
                table: "ConceptSurvey",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_PrototypeSurvey_PrototypeId",
                table: "PrototypeSurvey",
                column: "PrototypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PrototypeSurvey_SurveyId",
                table: "PrototypeSurvey",
                column: "SurveyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConceptSurvey");

            migrationBuilder.DropTable(
                name: "PrototypeSurvey");

            migrationBuilder.DropTable(
                name: "Survey");
        }
    }
}
