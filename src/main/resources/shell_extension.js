var _ZEPPELIN_TABLE_LIMIT_ = __ZEPPELIN_TABLE_LIMIT__;

function printTable(dbquery, fields, flattenArray) {

    var iterator = dbquery;

    if (toString.call( dbquery ) === '[object Array]') {
        iterator = (function() {
            var index = 0,
                data = dbquery,
                length = data.length;

            return {
                next: function() {
                    if (!this.hasNext()) {
                        return null;
                    }
                    return data[index++];
                },
                hasNext: function() {
                    return index < length;
                }
            }
        }());
    }

    // Flatten all the documents and get all the fields to build a table with all fields
    var docs = [];
    var createFieldSet = fields == null || fields.length == 0;
    var fieldSet = fields || [];

    while (iterator.hasNext()) {
        var doc = iterator.next();
        doc = flattenObject(doc, flattenArray);
        docs.push(doc);
        if (createFieldSet) {
            for (var i in doc) {
                if (doc.hasOwnProperty(i)) {
                    fieldSet.push(i);
                }
            }
        }
    }

    fields = fieldSet;

    var header = "%table ";
    fields.forEach(function (field) { header += field + "\t" })
    print(header.substring(0, header.length - 1));

    docs.forEach(function (doc) {
        var row = "";
        fields.forEach(function (field) { row += doc[field] + "\t" })
        print(row.substring(0, row.length - 1));
    });
}

DBQuery.prototype.table = function (fields, flattenArray) {
    if (this._limit > _ZEPPELIN_TABLE_LIMIT_) {
        this.limit(_ZEPPELIN_TABLE_LIMIT_);
    }
    printTable(this, fields, flattenArray);
}

if (typeof DBCommandCursor === 'function') {
  DBCommandCursor.prototype.table = DBQuery.prototype.table;
}
