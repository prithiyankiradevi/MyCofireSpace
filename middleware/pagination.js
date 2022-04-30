const math = require("math");

function paginated(model, limits, req, res) {
  const page = parseInt(req.query.page);
  const limit = limits;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};
  if (endIndex < model.length) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  result.totalPages = math.ceil(model.length / limit);
  result.result = model.slice(startIndex, endIndex);
  return result;
}

async function pagination(model, limits, req, res, calledFrom) {
  var k = await model.countDocuments().exec();

  const page = parseInt(req.query.page);
  const limit = limits;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = {};

  if (endIndex < k) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  await textSearchQuery(
    model,
    limit,
    req,
    calledFrom,
    startIndex,
    endIndex,
    result
  );
  res.status(200).send(result);
}

async function textSearchQuery(
  model,
  limit,
  req,
  calledFrom,
  startIndex,
  endIndex,
  result
) {
  const z = await model.find({ deleteFlag: "false" });
  const emptyarr = [];
  const emptyArr1 = [];
  // console.log(z)
  if (z == undefined || null) {
    return;
  } else {
    console.log(z.length)
    for (var i = 0; i < z.length; i++) {
     console.log('main')

      if (z[i].address.toLowerCase().includes(req.query.search.toLowerCase())) {
        console.log('firest if')
        emptyarr.push(z[i]);
      } 

      if(z[i].city.toLowerCase().includes(req.query.search.toLowerCase())) {
        console.log('2 if')

        emptyarr.push(z[i]);
      }
    }

  }

  console.log('line 87',emptyarr)


  result.total_no_od_data = emptyarr.length;
  result.total_pages = Math.ceil(emptyarr.length / limit);

  result.allDatas = emptyarr.slice(startIndex, endIndex);
}

module.exports = {
  paginated,
  pagination,
};