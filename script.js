document.addEventListener('DOMContentLoaded', function () {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();

    var yearSelect = document.getElementById('year-select');
    var monthSelect = document.getElementById('month-select');
    var calendarBody = document.getElementById('calendar-body');

    function saveEvent(date, event) {
        var events = JSON.parse(localStorage.getItem('events')) || {};
        events[date] = event;
        localStorage.setItem('events', JSON.stringify(events));
    }

    function getEvent(date) {
        var events = JSON.parse(localStorage.getItem('events')) || {};
        return events[date];
    }

    function populateYearSelect(startYear) {
        yearSelect.innerHTML = '';
        for (var year = startYear - 100; year <= startYear + 100; year++) {
            var option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            if (year === currentYear) {
                option.selected = true;
            }
            yearSelect.appendChild(option);
        }
    }

    populateYearSelect(currentYear);

    var months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    for (var month = 0; month < 12; month++) {
        var option = document.createElement('option');
        option.value = month;
        option.textContent = months[month];
        if (month === currentMonth) {
            option.selected = true;
        }
        monthSelect.appendChild(option);
    }
    function updateCalendar(year, month) {
        calendarBody.innerHTML = '';
        var firstDay = new Date(year, month, 1).getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();

        var date = 1;
        for (var i = 0; i < 6; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < 7; j++) {
                var cell = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    cell.textContent = '';
                } else if (date > daysInMonth) {
                    break;
                } else {
                    var eventDate = `${year}-${('0' + (month + 1)).slice(-2)}-${('0' + date).slice(-2)}`; // YYYY-MM-DD形式
                    var event = getEvent(eventDate);
                    cell.textContent = date;
                    if (event) {
                        cell.classList.add('has-event'); // 予定がある日にクラスを追加
                        cell.title = event;
                    }
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
            if (date > daysInMonth) { break; }
        }
    }

    updateCalendar(currentYear, currentMonth);

    yearSelect.addEventListener('change', function () {
        currentYear = parseInt(this.value, 10);
        updateCalendar(currentYear, currentMonth);
    });

    monthSelect.addEventListener('change', function () {
        currentMonth = parseInt(this.value, 10);
        updateCalendar(currentYear, currentMonth);
    });
    document.getElementById('prev-month').addEventListener('click', function () {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        if (currentYear < yearSelect.options[0].value || currentYear > yearSelect.options[yearSelect.options.length - 1].value) {
            populateYearSelect(currentYear);
        }
        updateCalendar(currentYear, currentMonth);
        yearSelect.value = currentYear;
        monthSelect.value = currentMonth;
    });

    document.getElementById('next-month').addEventListener('click', function () {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        if (currentYear < yearSelect.options[0].value || currentYear > yearSelect.options[yearSelect.options.length - 1].value) {
            populateYearSelect(currentYear);
        }
        updateCalendar(currentYear, currentMonth);
        yearSelect.value = currentYear;
        monthSelect.value = currentMonth;
    });

    calendarBody.addEventListener('click', function (e) {
        if (e.target.tagName === 'TD' && e.target.textContent !== '') {
            var selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${e.target.textContent.padStart(2, '0')}`;
            var eventText = prompt('予定を入力してください:', getEvent(selectedDate) || '');
            if (eventText != null) {
                saveEvent(selectedDate, eventText);
                updateCalendar(currentYear, currentMonth);
            }
        }
    });
});
