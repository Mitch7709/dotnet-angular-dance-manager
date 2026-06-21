using Core.Features.TimeSlots.Create;
using Core.Models;
using Core.Shared;
using Shouldly;

namespace UnitTests.TestSetup.TimeSlots
{
    public class CreateTimeSlotUseCaseTests
    {
        [Fact]
        public async Task TimeSlot_is_created_when_day_and_time_is_unique()
        {
            using var builder = new DBBuilder();
            var context = builder.CreateDBContext();
            var useCase = CreateUseCase(context);
            var request = new CreateTimeSlotRequest
            (
                StartTime: new TimeOnly(9, 0),
                DurationInMinutes: 60,
                DayOfWeek: "Monday"
            );

            Result<CreateTimeSlotResponse> result = await useCase.ExecuteAsync(request);

            result.IsSuccess.ShouldBeTrue();
            var response = result.Value;
            response.Id.ShouldBeGreaterThan(0);
            response.StartTime.ShouldBe(new TimeOnly(9, 0));
            response.DurationInMinutes.ShouldBe(60);
            response.DayOfWeek.ShouldBe(DayOfWeek.Monday);
        }


        public static CreateTimeSlotUseCase CreateUseCase(IDbContext dbContext)
        {
            return new CreateTimeSlotUseCase(dbContext);
        }
}
}
