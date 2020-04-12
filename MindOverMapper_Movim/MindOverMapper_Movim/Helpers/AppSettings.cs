using System;
namespace MindOverMapper_Movim.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string SendGridAPIKey { get; set; }
        public string awsTurkEndpoint { get; set; }
        public string awsSecret { get; set; }
        public string awsAccessKey { get; set; }
        public string awsRegion { get; set; }
        public string AzureFileStoreConnectionString { get; set; }
    }
}
