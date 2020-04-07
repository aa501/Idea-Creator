using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MindOverMapper_Movim.Surveys;

namespace MindOverMapper_Movim.Surveys
{
    public class SurveyFactory
    {
        public static ISurvey Build (SurveyTypes type)
        {
            ISurvey survey;
            switch(type)
            {
                case SurveyTypes.EmailSurvey:
                    survey = new EmailSurvey();
                    break;
                default:
                    throw new Exception("Invalid Survey Type");
            }
            return survey;
        }
    }
}
