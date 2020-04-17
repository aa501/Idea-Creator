using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MindOverMapper_Movim.Helpers;
using Microsoft.Azure;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.File;
using System.Threading;
using System.IO;

namespace MindOverMapper_Movim
{
    public class AzureFileService
    {
        private AppSettings _appSettings;
        private string Credentials;
        private CloudStorageAccount storageAccount;
        public AzureFileService(AppSettings appSettings)
        {
            this._appSettings = appSettings;
            this.Credentials = this._appSettings.AzureFileStoreConnectionString;
            this.storageAccount = CloudStorageAccount.Parse(this.Credentials);
        }

        public void storeFile(String path, String fileName, String uploadFile)
        {
            CloudFileClient fileClient = this.storageAccount.CreateCloudFileClient();
            CloudFileShare fileShare = fileClient.GetShareReference(this._appSettings.AzureFIleStoreName);

            if(fileShare.Exists())
            {
                CloudFileDirectory root = fileShare.GetRootDirectoryReference();
                CloudFileDirectory folder = root.GetDirectoryReference(path);
                if (!folder.Exists())
                {
                    folder.Create();
                }
                CloudFile file = folder.GetFileReference(fileName);
                using(AutoResetEvent waitHandle = new AutoResetEvent(false))
                {
                    ICancellableAsyncResult result = file.BeginUploadFromFile(uploadFile, ar => waitHandle.Set() , new object());
                    waitHandle.WaitOne();

                    file.EndUploadFromFile(result);
                }

            }


        }

        public CloudFile getFIle(String path, String fileName)
        {
            CloudFileClient fileClient = this.storageAccount.CreateCloudFileClient();
            CloudFileShare fileShare = fileClient.GetShareReference(this._appSettings.AzureFIleStoreName);
            if (fileShare.Exists())
            {
                CloudFileDirectory root = fileShare.GetRootDirectoryReference();
                CloudFileDirectory folder = root.GetDirectoryReference(path);
                CloudFile file = folder.GetFileReference(fileName);
                return file;
            }
            else
            {
                throw new Exception("File Share does not exists");
            }
        }

    }
}
