$(function () {
    $('#calendar').calendar({
        ifSwitch: true,
        hoverDate: true,
        backToday: true
    });
});;
(function ($, window, document, undefined) {
    var Calendar = function (elem, options) {
        this.$calendar = elem;
        this.defaults = {
            ifSwitch: true,
            hoverDate: false,
            backToday: false
        };
        this.opts = $.extend({}, this.defaults, options);
    };
    Calendar.prototype = {
        showHoverInfo: function (obj) {
            var _dateStr = $(obj).attr('data');
            var offset_t = $(obj).offset().top + (this.$calendar_today.height() - $(obj).height()) / 2;
            var offset_l = $(obj).offset().left + $(obj).width();
            var changeStr = addMark(_dateStr);
            var _week = changingStr(changeStr).getDay();
            var _weekStr = '';
            this.$calendar_today.show();
            this.$calendar_today.css({
                left: offset_l + 30,
                top: offset_t
            }).stop().animate({
                left: offset_l + 16,
                top: offset_t
            });
            switch (_week) {
                case 0:
                    _weekStr = '星期天';
                    break;
                case 1:
                    _weekStr = '星期一';
                    break;
                case 2:
                    _weekStr = '星期二';
                    break;
                case 3:
                    _weekStr = '星期三';
                    break;
                case 4:
                    _weekStr = '星期四';
                    break;
                case 5:
                    _weekStr = '星期五';
                    break;
                case 6:
                    _weekStr = '星期六';
                    break;
            }
            this.$calendarToday_date.text(changeStr);
            this.$calendarToday_week.text(_weekStr);
        },
        showCalendar: function () {
            var self = this;
            var year = dateObj.getDate().getFullYear();
            var month = dateObj.getDate().getMonth() + 1;
            var dateStr = returnDateStr(dateObj.getDate());
            var firstDay = new Date(year, month - 1, 1);
            this.$calendarTitle_text.text(year + '年' + dateStr.substr(4, 2)+'月');
            this.$calendarDate_item.each(function (i) {
                var allDay = new Date(year, month - 1, i + 1 - firstDay.getDay());
                var allDay_str = returnDateStr(allDay);
                $(this).text(allDay.getDate()).attr('data', allDay_str);
                if (returnDateStr(new Date()) === allDay_str) {
                    $(this).attr('class', 'item item-curDay');
                } else if (returnDateStr(firstDay).substr(0, 6) === allDay_str.substr(0, 6)) {
                    $(this).attr('class', 'item item-curMonth');
                } else {
                    $(this).attr('class', 'item');
                }
            });
            if (self.selected_data) {
                var selected_elem = self.$calendar_date.find('[data=' + self.selected_data + ']');
                selected_elem.addClass('item-selected');
            }
        },
        renderDOM: function () {
            this.$calendar_title = $('<div class="calendar-title"></div>');
            this.$calendar_week = $('<ul class="calendar-week"></ul>');
            this.$calendar_date = $('<ul class="calendar-date"></ul>');
            this.$calendar_today = $('<div class="calendar-today"></div>');
            var _titleStr = '<a href="#" class="title"></a>' +
                '<a href="javascript:;" id="backToday">T</a>' +
                '<div class="arrow">' +
                '<span class="arrow-prev"><</span>' +
                '<span class="arrow-next">></span>' +
                '</div>';
            var _weekStr = '<li class="item">日</li>' +
                '<li class="item">一</li>' +
                '<li class="item">二</li>' +
                '<li class="item">三</li>' +
                '<li class="item">四</li>' +
                '<li class="item">五</li>' +
                '<li class="item">六</li>';
            var _dateStr = '';
            var _dayStr = '<i class="triangle"></i>' +
                '<p class="date"></p>' +
                '<p class="week"></p>';
            for (var i = 0; i < 6; i++) {
                _dateStr += '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>' +
                    '<li class="item">26</li>';
            }
            this.$calendar_title.html(_titleStr);
            this.$calendar_week.html(_weekStr);
            this.$calendar_date.html(_dateStr);
            this.$calendar_today.html(_dayStr);
            this.$calendar.append(this.$calendar_title, this.$calendar_week, this.$calendar_date, this.$calendar_today);
            this.$calendar.show();
        },
        inital: function () {
            var self = this;
            this.renderDOM();
            this.$calendarTitle_text = this.$calendar_title.find('.title');
            this.$backToday = $('#backToday');
            this.$arrow_prev = this.$calendar_title.find('.arrow-prev');
            this.$arrow_next = this.$calendar_title.find('.arrow-next');
            this.$calendarDate_item = this.$calendar_date.find('.item');
            this.$calendarToday_date = this.$calendar_today.find('.date');
            this.$calendarToday_week = this.$calendar_today.find('.week');
            this.selected_data = 0;
            this.showCalendar();
            if (this.opts.ifSwitch) {
                this.$arrow_prev.bind('click', function () {
                    var _date = dateObj.getDate();
                    dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() - 1, 1));
                    self.showCalendar();
                });
                this.$arrow_next.bind('click', function () {
                    var _date = dateObj.getDate();
                    dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth() + 1, 1));
                    self.showCalendar();
                });
            }
            if (this.opts.backToday) {
                var cur_month = dateObj.getDate().getMonth() + 1;
                this.$backToday.bind('click', function () {
                    var item_month = $('.item-curMonth').eq(0).attr('data').substr(4, 2);
                    var if_lastDay = (item_month != cur_month) ? true : false;
                    if (!self.$calendarDate_item.hasClass('item-curDay') || if_lastDay) {
                        dateObj.setDate(new Date());
                        self.showCalendar();
                    }
                });
            }
            this.$calendarDate_item.hover(function () {
                self.showHoverInfo($(this));
            }, function () {
                self.$calendar_today.css({
                    left: 0,
                    top: 0
                }).hide();
            });
            this.$calendarDate_item.click(function () {
                var _dateStr = $(this).attr('data');
                var _date = changingStr(addMark(_dateStr));
                var $curClick = null;
                self.selected_data = $(this).attr('data');
                dateObj.setDate(new Date(_date.getFullYear(), _date.getMonth(), 1));
                if (!$(this).hasClass('item-curMonth')) {
                    self.showCalendar();
                }
                $curClick = self.$calendar_date.find('[data=' + _dateStr + ']');
                $curDay = self.$calendar_date.find('.item-curDay');
                if (!$curClick.hasClass('item-selected')) {
                    self.$calendarDate_item.removeClass('item-selected');
                    $curClick.addClass('item-selected');
                }
            });
        },
        constructor: Calendar
    };
    $.fn.calendar = function (options) {
        var calendar = new Calendar(this, options);
        return calendar.inital();
    };
    var dateObj = (function () {
        var _date = new Date();
        return {
            getDate: function () {
                return _date;
            },
            setDate: function (date) {
                _date = date;
            }
        }
    })();

    function returnDateStr(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        month = month <= 9 ? ('0' + month) : ('' + month);
        day = day <= 9 ? ('0' + day) : ('' + day);
        return year + month + day;
    };

    function changingStr(fDate) {
        var fullDate = fDate.split("-");
        return new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);
    };

    function addMark(dateStr) {
        return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substring(6);
    };

    function isLeapYear(year) {
        return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
    }
})(jQuery, window, document);