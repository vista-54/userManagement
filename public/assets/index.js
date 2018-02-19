/**
 * Created by vista on 18.02.18.
 */
(function () {

    var showUserFormBtn = document.getElementById('show_user_form_btn');
    var submitUserBtn = document.getElementById('submit_user_btn');
    var userForm = document.getElementsByClassName('add_user_form')[0];
    var limitSelector = document.getElementById('limit');
    var nextBtn = document.getElementById('next');
    var prevBtn = document.getElementById('previous');
    var pagesTotal = document.getElementById('pages_total');
    var enterPageBtn = document.getElementById('enter_page_btn');
    var pageNumberInpt = document.getElementById('page_number_inpt');
    var currentpage = 0;
    var pages, limit;

    showUserFormBtn.addEventListener('click', showUserForm);
    submitUserBtn.addEventListener('click', addUser);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    limitSelector.addEventListener('change', index);
    enterPageBtn.addEventListener('click', enterPageNumber);


    function showUserForm() {
        userForm.style.display = "block"
    }

    function addUser() {
        var username = document.getElementsByName('username')[0].value;
        var email = document.getElementsByName('email')[0].value;
        var password = document.getElementsByName('password')[0].value;
        var fd = new FormData();
        if (username !== '' && username.length >= 3 && email !== '' && email.indexOf('@') !== -1 && email.indexOf('.') !== -1 && password !== '' && password.length >= 6) {
            fd.append("username", username);
            fd.append("email", email);
            fd.append("password", password);
            request("post", 'user.php?action=add', fd, function (result) {
                if (result) {
                    index();
                }
            })
        }
        else {
            alert('One or more fields are invalid');
        }

    }


    function request(type, url, data, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open(type, url, false);


        xhr.onreadystatechange = function () {
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            }
            else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                callback(xhr.responseText);
            }
            ;
        };
        xhr.send(data);
    }

    function index() {

        if (typeof pages !== 'undefined' && typeof limit !== 'undefined') {
            debugger
            var _limit = document.getElementById('limit').value;
            var oldCountOfPages = Math.ceil((pages - 1) * limit / _limit);
            if (currentpage > oldCountOfPages) {
                currentpage = Math.ceil(oldCountOfPages / _limit);
            }
        }
        limit = document.getElementById('limit').value;
        request("get", 'user.php?action=index&limit=' + limit + '&offset=' + (currentpage * limit), {}, function (response) {
            if (currentpage > 0) {
                prevBtn.disabled = false;
            }
            pageNumberInpt.value = '';
            userForm.style.display = "none";
            var result = JSON.parse(response);
            var users = result.users;
            var records = result.total;
            pages = Math.ceil(records / limit);
            pagesTotal.innerText = pages - 1;
            nextBtn.disabled = !(currentpage < (pages - 1));

            var table = document.getElementById('user_list');
            table.innerHTML = '';
            for (var i in users) {
                var obj = users[i];
                var tr =
                    "<tr>" +
                    "<th>" + obj.id + "</th>" +
                    "<th>" + obj.username + "</th>" +
                    "<th>" + obj.email + "</th>" +
                    "<th>" + obj.password_hash + "</th>" +
                    "<th>" + dateConvert(obj.created_at) + "</th>" +
                    "<th>" + dateConvert(obj.updated_at) + "</th>" +
                    "</tr>";
                table.insertAdjacentHTML('beforeend', tr);
            }
        })

    }

    function dateConvert(timestamp) {
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    index();

    function next() {
        prevBtn.disabled = false;
        currentpage++;
        index();
    }

    function prev() {
        currentpage--;
        if (currentpage === 0) {
            prevBtn.disabled = true;

        }
        index();
    }

    function enterPageNumber() {
        var pagenumber = pageNumberInpt.value;
        if (pagenumber < 0 || pagenumber > pages) {
            alert('The page number should be less than total count of pages');
            return false;
        }
        currentpage = pagenumber;
        index();
    }


})();
