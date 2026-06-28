namespace Core.Helpers;

public static class PhotoHelpers
{
    public static string GetImagePublicId(string imageUrl)
    {
        var uri = new Uri(imageUrl);
        var segments = uri.Segments;

        var fileNameWithExtension = segments.Last();
        var fileName = Path.GetFileNameWithoutExtension(fileNameWithExtension);

        return fileName;
    }

}
