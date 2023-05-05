const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>查询OpenAI-API密钥信息</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <style>
    table th {
      width: 30%;
      white-space: nowrap;
    }
  </style>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mt-5">查询API密钥信息</h1>
          <form class="mt-4">
            <div class="form-group mb-3">
              <label for="api-key">API密钥</label>
              <input type="text" id="api-key" name="api-key" class="form-control" required autocomplete="off" placeholder="请输入sk-开头的OpenAi-API密钥">
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
            </tbody>
          </table>
          <script>
            const form = document.querySelector('form')
            const apiKeyInput = document.querySelector('#api-key')
            const resultTable = document.querySelector('#result')

            form.addEventListener('submit', async (event) => {
              event.preventDefault()
            
              const apiKey = apiKeyInput.value
              const response = await fetch('/api?key=' + apiKey)
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
                const accessUntilDate = new Date(data.access_until * 1000);
                accessUntilDate.setHours(accessUntilDate.getHours() + 8);
                const accessUntilDateString = accessUntilDate.toISOString().slice(0, 19).replace('T', ' ');
                document.querySelector('#access_until').innerText = accessUntilDateString;
                resultTable.classList.remove('d-none')
              }
            })
            
          </script>
        </div>
      </div>
    </div>
  </body>
</html>

`

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  if (url.pathname === '/api') {
    const apiKey = url.searchParams.get('key')
    if (!apiKey) {
      return new Response('缺少API密钥', { status: 400 })
    }

    const queryUrl = 'https://api.openai.com/dashboard/billing/subscription'
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.64',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': '*/*',
      'Host': 'api.openai.com',
      'Connection': 'keep-alive'
    }

    try {
      const response = await fetch(queryUrl, { headers })
      const data = await response.json()
      const formatDate = (d) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')}`;
      const startDate = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
      const endDate = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));

      const usageResponse = await fetch(`https://api.openai.com/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`, { headers })
      const usageData = await usageResponse.json()

      const used = usageData.total_usage ? Math.round(usageData.total_usage) / 100 : 0
      const subscription = data.hard_limit_usd ? Math.round(data.hard_limit_usd * 100) / 100 : 0
      data.used = used
      data.subscription = subscription

      return new Response(JSON.stringify(data, null, 2), { status: 200 })
    } catch (err) {
      if (data.error) {
        return new Response(JSON.stringify({ error: '出错了' }), { status: 500 })
      }
      
    }
  }
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
}

