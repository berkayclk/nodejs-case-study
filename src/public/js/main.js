(function ($) {
    setNoData(false);
    setLoading(true);
    $.ajax({
        type: 'GET',
        url: '/records',
        success: (d) => mapDataTable(d),
        error: (err) => alert(err.responseJSON ? err.responseJSON.msg : 'Error!'),
        contentType: 'application/json',
    });
})(jQuery);

function sendFilterReq() {
    setNoData(false);
    setLoading(true);
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const minCount = Number($('#minCount').val());
    const maxCount = Number($('#maxCount').val());

    const reqBody = {
        startDate,
        endDate,
        minCount,
        maxCount,
    };

    $.ajax({
        type: 'POST',
        url: '/records/findByDateAndCount',
        data: JSON.stringify(reqBody),
        success: (d) => mapDataTable(d),
        error: (err) => alert(err.responseJSON ? err.responseJSON.msg : 'Error!'),
        dataType: 'json',
        contentType: 'application/json',
    });
}

function mapDataTable(data) {
    setLoading(false);
    resetRows();
    if (!data || !data.records || !data.records.length) {
        setNoData(true);
        return;
    }

    setNoData(false);
    const rows = data.records.map(
        (d) =>
            `<div class="row data-row">
                <div class="cell" data-title="Key">${d.key}</div>
                <div class="cell" data-title="Create Date">${d.createdAt}</div>
                <div class="cell" data-title="Total Count">${d.totalCount}</div>
        </div>`
    );
    $('#table-header').after(rows);
}

function resetRows() {
    $('.data-row').remove();
}
function setLoading(isVisible = true) {
    $('.loading').css('display', isVisible ? 'table-row' : 'none');
}

function setNoData(isVisible = true) {
    $('.nodata').css('display', isVisible ? 'table-row' : 'none');
}
