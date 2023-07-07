const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>查询OpenAI-API密钥信息</title>
    <link rel="icon" href="https://v2.cm/2023/06/26/6499a5821bb10.png" type="image/png">
    <meta name="description" content="OpenAI API,API密钥查询,查询OpenAI API密钥信息,API密钥信息查询,OpenAI账户信息查询,OpenAI API账户查询,OpenAI账户信息,查询OpenAI API账户信息,OpenAI API账户信息查询,查询OpenAI API账户信息和使用情况，查询OpenAI API密钥信息的网站。">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script async src="https://umam.zeabur.app/log" data-website-id="b0bad0cd-a3c5-4fe6-8461-ff59f9bcd253"></script>
    </head>
  <style>
    .footer {
        text-align: center;
    }

    .footer span {
        display: inline-block;
    }

    .form-row .form-group {
      display: inline-block;
    }
  </style>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mt-5">查询API密钥信息</h1>
          <form class="mt-4" method="post">
            <div class="form-group mb-3">
              <label for="api-key">API密钥</label>
              <input type="text" id="api-key" name="api-key" class="form-control" required autocomplete="off" placeholder="请输入sk-开头的OpenAi-API密钥">
            </div>
            <div class="form-row">
              <div class="form-group mb-3">
                <label for="start-date">开始日期</label>
                <input type="date" id="start-date" name="start-date" class="form-control" required>
              </div>
              <div class="form-group mb-3">
                <label for="end-date">结束日期</label>
                <input type="date" id="end-date" name="end-date" class="form-control" required>
              </div>
            </div>
            <div class="d-grid">
              <input type="submit" value="查询" class="btn btn-primary">
            </div>
          </form>
          <br>
          <div id="error-message" class="alert alert-danger d-none"></div>
          <br>
          <table id="result" class="table table-bordered d-none">
            <tbody>
              <tr>
                <th>账户名称</th>
                <td id="account_name"></td>
              </tr>
              <tr>
                <th>是否绑卡</th>
                <td id="payment_method_status"></td>
              </tr>
              <tr>
                <th>近两个月已消费</th>
                <td id="used"></td>
              </tr>
              <tr>
                <th>每月消费硬限制</th>
                <td id="subscription"></td>
              </tr>
              <tr>
                <th>账户授信总额度</th>
                <td id="system_hard_limit_usd"></td>
              </tr>
              <tr>
                <th>赠送额度有效期</th>
                <td id="access_until"></td>
              </tr>
              <tr>
  <th>是否具有GPT-4权限</th>
  <td id="gpt_4_permission"></td>
</tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
    <footer class="footer">
        <div class="container">
            <span class="text-muted">🥳每日请求数量有限，推荐<a href="https://github.com/Aiayw/OpenAI-API-Key/">自行部署</a></span>
        </div>
    </footer>
    <script>
    document.addEventListener('DOMContentLoaded', (event) => {
      // 获取当前日期
      let currentDate = new Date();
    
      // 获取当月的第一天
      let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      startDateInput.value = firstDayOfMonth.toISOString().substr(0,10);
    
      // 获取当前日期的次日
      let nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      endDateInput.value = nextDay.toISOString().substr(0,10);
    });

    const form = document.querySelector('form')
    const apiKeyInput = document.querySelector('#api-key')
    const resultTable = document.querySelector('#result')
    const startDateInput = document.querySelector('#start-date')
    const endDateInput = document.querySelector('#end-date')
    form.addEventListener('submit', async (event) => {
      event.preventDefault()
    
      const apiKey = apiKeyInput.value
      const startDate = startDateInput.value
      const endDate = endDateInput.value
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: apiKey, start_date: startDate, end_date: endDate })
      })
      const data = await response.json()
      if (data.error) {
        const errorMessage = document.querySelector('#error-message')
        errorMessage.innerText = data.error.message || '出错了'
        errorMessage.classList.remove('d-none')
        resultTable.classList.add('d-none')
      } else {
        const errorMessage = document.querySelector('#error-message')
        errorMessage.classList.add('d-none')
        document.querySelector('#account_name').innerText = data.account_name
        document.querySelector('#payment_method_status').innerText = data.has_payment_method ? '已绑卡' : '未绑卡';
        document.querySelector('#system_hard_limit_usd').innerText = data.system_hard_limit_usd
        document.querySelector('#used').innerText = data.used
        document.querySelector('#subscription').innerText = data.subscription
        document.querySelector('#gpt_4_permission').innerText = data.hasGPT4Permission ? '有权限' : '无权限';
        resultTable.classList.remove('d-none')
        const accessUntilDate = new Date(data.access_until * 1000);
        accessUntilDate.setHours(accessUntilDate.getHours() + 8);
        const accessUntilDateString = accessUntilDate.toISOString().slice(0, 19).replace('T', ' ');
        document.querySelector('#access_until').innerText = accessUntilDateString;
        resultTable.classList.remove('d-none')
      }
    })
    
  </script>
  </body>
</html>

`;

const QUERY_URL = "https://api.openai.com/dashboard/billing/subscription";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64",
  Authorization: "",
  Accept: "*/*",
  Host: "api.openai.com",
  Connection: "keep-alive",
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function fetchAPI(url) {
  const response = await fetch(url, { headers: HEADERS });
  return await response.json();
}

async function handleRequest(request) {
  if (request.method === "POST" && request.url.includes("/api")) {
    let body = await request.json();
    const apiKey = body.key;
    const startDate = body.start_date;
    const endDate = body.end_date;
    
    if (!apiKey) {
      return new Response("缺少API密钥", { status: 400 });
    }

    HEADERS.Authorization = `Bearer ${apiKey}`;

    try {
      const data = await fetchAPI(QUERY_URL);
      const usageData = await fetchAPI(
        `https://api.openai.com/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`
      );
      const modelPermissionData = await fetchAPI(`https://api.openai.com/v1/models/gpt-4`);

      const used = usageData.total_usage
        ? Math.round(usageData.total_usage) / 100
        : 0;
      const subscription = data.hard_limit_usd
        ? Math.round(data.hard_limit_usd * 100) / 100
        : 0;
      
      data.used = used;
      data.subscription = subscription;
      data.hasGPT4Permission = modelPermissionData.id === "gpt-4";
      
      return new Response(JSON.stringify(data))
    } catch (error) {
      return new Response('API调用失败', { status: 500 })
    }
  } else {
    return new Response(html, { headers: { 'content-type': 'text/html' } })
  }
}

