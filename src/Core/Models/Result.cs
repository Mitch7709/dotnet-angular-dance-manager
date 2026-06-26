using System.Diagnostics.CodeAnalysis;

namespace Core.Models;

public enum ErrorType
{
    NotFound,
    ValidationError,
    ImportError,
    DataError,
    Conflict,
    PhotoUploadError
}

public class Result
{
    public bool IsSuccess { get; set; }

    [MemberNotNullWhen(true, nameof(ErrorType))]
    public bool IsFailure => !IsSuccess;
    public ErrorType? ErrorType { get; }
    public string ErrorMessage { get; }

    protected Result(bool isSuccess, ErrorType? errorType, string errorMessage)
    {
        IsSuccess = isSuccess;
        ErrorType = errorType;
        ErrorMessage = errorMessage;
    }

    public static Result Success()
    {
        return new Result(true, null, string.Empty);
    }

    public static Failure Failure(ErrorType errorType, string errorMessage)
    {
        return new Failure(errorType, errorMessage);
    }

    public static implicit operator Result(Failure failure) => new(false, failure.ErrorType, failure.ErrorMessage);
}

public class Result<T> : Result
{
    private readonly T? _value;

    private Result(bool isSuccess, ErrorType? errorType, string errorMessage, T? value)
        : base(isSuccess, errorType, errorMessage)
    {
        _value = value;
    }

    [NotNull]
    public T Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("The value of a failure result can't be accessed.");

    public static Result<T> Success(T value)
    {
        return new Result<T>(true, null, string.Empty, value);
    }

    public static implicit operator Result<T>(T value) => Success(value);
    public static implicit operator Result<T>(Failure failure) => new(false, failure.ErrorType, failure.ErrorMessage, default);
}

public class Failure
{
    public ErrorType ErrorType { get; }
    public string ErrorMessage { get; }

    internal Failure(ErrorType errorType, string errorMessage)
    {
        ErrorType = errorType;
        ErrorMessage = errorMessage;
    }
}
