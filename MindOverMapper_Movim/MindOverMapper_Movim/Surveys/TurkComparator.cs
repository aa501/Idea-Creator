using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.MTurk;
namespace MindOverMapper_Movim.Surveys
{
    public static class TurkComparator
    {
       public static Comparator getComparator(String comparator)
        {
            Comparator turkComparator;
            switch (comparator)
            {
                
                case "Equals":
                    turkComparator = Comparator.EqualTo;
                break;

                case "Greater Than":
                    turkComparator = Comparator.GreaterThan;
                break;
                case "Greater Than Or Equal":
                    turkComparator = Comparator.GreaterThanOrEqualTo;
                    break;
                case "Less Than":
                    turkComparator = Comparator.LessThan;
                    break;
                case "Less Than Or Equal":
                    turkComparator = Comparator.LessThanOrEqualTo;
                    break;
                case "Not Equal":
                    turkComparator = Comparator.NotEqualTo;
                    break;
                case "In":
                    turkComparator = Comparator.In;
                    break;
                case "Not In":
                    turkComparator = Comparator.NotIn;
                    break;
                case "Does Not Exist":
                    turkComparator = Comparator.DoesNotExist;
                    break;
                case "Exists":
                    turkComparator = Comparator.Exists;
                    break;
                default:
                    throw new Exception("Unknown Amazon Turk Comparator");
            }

            return turkComparator;
        }

        public static IList<string> getComparators()
        {
            IList<String> comparators = new List<String>();
            comparators.Add("Equals");
            comparators.Add("Greater Than");
            comparators.Add("Greater Than Or Equal");
            comparators.Add("Less Than");
            comparators.Add("Less Than Or Equal");
            comparators.Add("Not Equal");
            comparators.Add("In");
            comparators.Add("Not In");
            comparators.Add("Does Not Exist");
            comparators.Add("Exists");
            return comparators;
        }
        public static String getStringComparator(Comparator comparator)
        {
            if (comparator == Comparator.EqualTo.Value)
                return "Equals";
            if( comparator == Comparator.GreaterThan)
                return "Greater Than";
            if (comparator == Comparator.GreaterThanOrEqualTo)
                return "Greater Than Or Equal";
            if (comparator == Comparator.LessThan)
                    return "Less Than";
            if (comparator == Comparator.LessThanOrEqualTo)
                    return "Less Than Or Equal";
            if (comparator == Comparator.NotEqualTo)
                    return "Not Equal";
            if (comparator == Comparator.In)
                    return "In";
            if (comparator == Comparator.NotIn)
                    return "Not In";
            if (comparator == Comparator.DoesNotExist)
                    return "Does Not Exist";
            if (comparator == Comparator.Exists)
                    return "Exists";
            throw new Exception("Unknown Amazon Turk Comparator");
        }

    }

   
}
