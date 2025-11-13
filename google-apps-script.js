// ============================================
// GOOGLE APPS SCRIPT для работы с регистрацией
// ============================================

// Этот скрипт нужно разместить в Google Apps Script,
// привязанный к вашей Google Таблице

function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Получаем активную таблицу
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (action === 'register') {
      // РЕГИСТРАЦИЯ нового пользователя
      return handleRegistration(sheet, data);
      
    } else if (action === 'login') {
      // ВХОД существующего пользователя
      return handleLogin(sheet, data);
      
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Неизвестное действие'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Функция регистрации
function handleRegistration(sheet, data) {
  const { name, email, age } = data;
  
  // Проверяем, есть ли уже пользователь с таким email
  const emailColumn = 2; // Колонка B (email)
  const allEmails = sheet.getRange(2, emailColumn, sheet.getLastRow()).getValues();
  
  for (let i = 0; i < allEmails.length; i++) {
    if (allEmails[i][0] === email) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Пользователь с таким email уже существует'
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Добавляем нового пользователя
  const timestamp = new Date();
  sheet.appendRow([name, email, age, timestamp]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Регистрация прошла успешно'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Функция входа
function handleLogin(sheet, data) {
  const { email } = data;
  
  // Ищем пользователя по email
  const emailColumn = 2; // Колонка B (email)
  const allData = sheet.getRange(2, 1, sheet.getLastRow(), 4).getValues();
  
  for (let i = 0; i < allData.length; i++) {
    if (allData[i][1] === email) { // allData[i][1] это email
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Вход выполнен',
        user: {
          name: allData[i][0],
          email: allData[i][1],
          age: allData[i][2]
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // Пользователь не найден
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'Пользователь с таким email не найден'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Функция для тестирования (можно запустить вручную)
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Проверяем заголовки
  const headers = sheet.getRange(1, 1, 1, 4).getValues()[0];
  Logger.log('Заголовки: ' + headers);
  
  // Если заголовков нет, создаём их
  if (!headers[0]) {
    sheet.getRange(1, 1, 1, 4).setValues([['Имя', 'Email', 'Возраст', 'Дата регистрации']]);
    
    // Форматируем заголовки
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#a80000').setFontColor('#ffffff');
    
    Logger.log('Заголовки созданы');
  }
}
