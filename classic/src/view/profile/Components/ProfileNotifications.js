Ext.define('Admin.view.profile.Components.Notifications', {
    extend: 'Ext.DataView',
    xtype: 'profilenotifications',

    cls: 'user-notifications',
    //scrollable: true,
    scrollable: 'y',
    config: {
        loadMask: false
        //loadingText: ''
    },
    store: 'usershareditems_str',
    maxHeight: Ext.Element.getViewportHeight() - 205,
    itemSelector: 'div.timeline-item',
    itemTpl: [
        "<div class='comments'>",
        "<img src='{profile_pic:this.hasValue}' alt='Profile Picture' class='profile-icon'>",
        "<div class='content-wrap'>",
        "<div>",
        "<h4 class='profilenotifications-username'>{sender_fname} {sender_lname}</h4>",
        "<span class='from-now'><span class='x-fa fa-clock-o'></span>{date:this.elapsed}</span>",
        "</div>",
        "<div class='content'>{content}</div>",
        "<div class='like-comment-btn-wrap'>",
        /*  "<button type='button' class='x-fa fa-thumbs-up' onclick=''></button>",
          "<button type='button' class='x-fa fa-thumbs-down' onclick=''></button>",
          "<button type='button' onclick='' class='x-fa fa-comments'></button>",*/
        "</div>",
        "</div>",
        "</div>",

        {
            cls: function (value, record, previous, index, count) {
                var cls = '';

                if (!index) {
                    cls += ' timeline-item-first';
                }
                if (index + 1 === count) {
                    cls += ' timeline-item-last';
                }

                return cls;
            },

            elapsed: function (value) {
                var d = new Date(Date.parse(value)).getTime();
                var now = Date.now();
                //now = +new Date('2015/08/23 21:15:00'); // 9:15 PM (For demo only)
                //now = +new Date(now); // 9:15 PM (For demo only)

                var seconds = Math.floor((now - d) / 1000),
                    minutes = Math.floor(seconds / 60),
                    hours = Math.floor(minutes / 60),
                    days = Math.floor(hours / 24),
                    weeks = Math.floor(days / 7),
                    rem_week_days = days % 7,
                    months = Math.floor(days / 30),
                    rem_month_days = days % 30,//Math.floor(days / 30),
                    years = Math.floor(days / 365),
                    ret;

                months %= 12;
                weeks %= 52;
                days %= 365;
                hours %= 24;
                minutes %= 60;
                seconds %= 60;

                if (years) {
                    ret = this.part(years, 'Yr');
                    ret += this.part(months, 'Mth', ' ');
                } else if (months) {
                    ret = this.part(months, 'Mth');
                    ret += this.part(rem_month_days, 'Day', ' ');
                } else if (weeks) {
                    ret = this.part(weeks, 'Wk');
                    ret += this.part(rem_week_days, 'Day', ' ');
                } else if (days) {
                    ret = this.part(days, 'Day');
                    ret += this.part(hours, 'Hr', ' ');
                } else if (hours) {
                    ret = this.part(hours, 'Hr');
                } else if (minutes) {
                    ret = this.part(minutes, ' Min');
                } else {
                    ret = this.part(seconds, 'Sec');
                }
                return this.stripPart(ret);
            },

            stripPart: function (val) {
                if (val == 'now' || val === 'now') {
                    return val;
                }
                return val + ' ago';
            },

            epoch: function (value, record, previous, index, count) {
                var previousValue = previous &&
                    (previous.isModel ? previous.data : previous)['date'];

                // TODO use previousValue and value to determine "Yesterday", "Last week",
                // "Last month", etc...

                /* if (index === 4) {
                     return '<div class="timeline-epoch">Yesterday</div>';
                 }*/

                return '';
            },

            part: function (value, type, gap) {
                var ret = value ? (gap || '') + value + ' ' + type : '';
                if (value > 1) {
                    ret += 's';
                } else {
                    ret = 'now';
                }
                return ret;
            },

            hasValue: function (value) {
                if (value) {
                    return 'resources/images/user-profile/' + value;
                }
                return 'resources/images/placeholder.png';
            }
        }

    ]
});
