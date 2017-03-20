portal.service("Tool", function()
{
    this.preciseDate = function(stamp)
    {
        var date = new Date(stamp).toISOString().split("T");
        var time = date[1].slice(0, 5);
        var amPM = time[0].split(":")[0] < 12 ? 'am' : 'pm';

        return date[0] + " (at " + time + ")";
    }

    this.isOfferLive = function(startDate, endDate, callback)
    {
        var currentDate = new Date();
        var live = false;

        if(startDate > currentDate)
        {
            callback("Future", "label-warning");
            return;
        }

        if(startDate <= currentDate && endDate > currentDate)
        {
            callback("Live", "label-success");
            return;
        }
        else
        {
            callback("Ended", "label-danger");
            return;
        }
    }

    this.calculateRemainingTime = function(endDate)
    {
        var startDate = new Date();
        
        var delta = Math.abs(endDate - startDate) / 1000;

        // calculate (and subtract) whole days
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        var string = "";

        string += days > 0 ? days + " days, " : '';
        string += hours > 0 ? hours + " hours " : '';
        string += minutes > 0 ? minutes + " minutes" : '';

        return string;
    }
})