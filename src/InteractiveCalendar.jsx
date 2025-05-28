import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, Save, X, Filter, Download, Calendar, Clock, Grid, List } from 'lucide-react';

const InteractiveCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'year', 'week', 'day'
  const [language, setLanguage] = useState('it');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Traduzioni multilingua
  const translations = {
    it: {
      title: 'Calendario KORABI',
      newEvent: 'Nuovo Evento',
      upcomingEvents: 'Prossimi Eventi',
      noEvents: 'Nessun evento in programma',
      editEvent: 'Modifica Evento',
      eventTitle: 'Titolo',
      description: 'Descrizione',
      date: 'Data',
      time: 'Ora',
      category: 'Categoria',
      color: 'Colore',
      save: 'Salva',
      update: 'Aggiorna',
      cancel: 'Annulla',
      delete: 'Elimina',
      filter: 'Filtra',
      export: 'Esporta PDF',
      print: 'Stampa',
      syncGoogle: 'Sincronizza Google',
      month: 'Mese',
      year: 'Anno',
      week: 'Settimana',
      day: 'Giorno',
      today: 'Oggi',
      all: 'Tutti',
      months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
               'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      daysOfWeek: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
      daysOfWeekFull: ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
    },
    en: {
      title: 'KORABI Calendar',
      newEvent: 'New Event',
      upcomingEvents: 'Upcoming Events',
      noEvents: 'No upcoming events',
      editEvent: 'Edit Event',
      eventTitle: 'Title',
      description: 'Description',
      date: 'Date',
      time: 'Time',
      category: 'Category',
      color: 'Color',
      save: 'Save',
      update: 'Update',
      cancel: 'Cancel',
      delete: 'Delete',
      filter: 'Filter',
      export: 'Export PDF',
      print: 'Print',
      syncGoogle: 'Sync Google',
      month: 'Month',
      year: 'Year',
      week: 'Week',
      day: 'Day',
      today: 'Today',
      all: 'All',
      months: ['January', 'February', 'March', 'April', 'May', 'June',
               'July', 'August', 'September', 'October', 'November', 'December'],
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      daysOfWeekFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  };

  const t = translations[language];

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'work',
    color: '#3B82F6'
  });

  const categories = {
    work: { name: language === 'it' ? 'Lavoro' : 'Work', color: 'bg-blue-500' },
    personal: { name: language === 'it' ? 'Personale' : 'Personal', color: 'bg-green-500' },
    health: { name: language === 'it' ? 'Salute' : 'Health', color: 'bg-red-500' },
    social: { name: language === 'it' ? 'Sociale' : 'Social', color: 'bg-purple-500' },
    other: { name: language === 'it' ? 'Altro' : 'Other', color: 'bg-gray-500' }
  };

  // Simulazione Google Calendar API
  const syncWithGoogleCalendar = async () => {
    // Questo è un esempio - in produzione useresti la vera API di Google
    const mockGoogleEvents = [
      {
        id: 'google-1',
        title: 'Meeting Google',
        description: 'Sincronizzato da Google Calendar',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        category: 'work',
        color: '#4285f4',
        source: 'google'
      }
    ];
    
    setEvents(prev => [...prev, ...mockGoogleEvents]);
    alert(language === 'it' ? 'Sincronizzazione completata!' : 'Sync completed!');
  };

  // Funzione per esportare PDF
  const exportToPDF = () => {
    const printContent = document.getElementById('calendar-content');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${t.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
            .day-cell { border: 1px solid #ccc; padding: 10px; min-height: 100px; }
            .event { background: #3B82F6; color: white; padding: 2px 5px; margin: 2px 0; border-radius: 3px; font-size: 12px; }
            h1 { text-align: center; color: #333; }
            .month-header { text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>${t.title}</h1>
          <div class="month-header">${t.months[currentDate.getMonth()]} ${currentDate.getFullYear()}</div>
          ${generatePrintableCalendar()}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintableCalendar = () => {
    const days = getDaysInMonth(currentDate);
    let html = '<div class="calendar-grid">';
    
    // Header giorni settimana
    t.daysOfWeek.forEach(day => {
      html += `<div style="font-weight: bold; text-align: center; padding: 10px;">${day}</div>`;
    });
    
    days.forEach(day => {
      html += `<div class="day-cell">`;
      if (day) {
        html += `<div style="font-weight: bold; margin-bottom: 5px;">${day}</div>`;
        const dayEvents = getEventsForDate(day);
        dayEvents.forEach(event => {
          html += `<div class="event" style="background-color: ${event.color}">${event.title}</div>`;
        });
      }
      html += `</div>`;
    });
    
    html += '</div>';
    return html;
  };

  // Chiudi menu quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu && !event.target.closest('.relative')) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsMenu]);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  // Get week days
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const getEventsForDateStr = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  const getFilteredEvents = () => {
    let filteredEvents = events;
    if (categoryFilter !== 'all') {
      filteredEvents = events.filter(event => event.category === categoryFilter);
    }
    return filteredEvents
      .filter(event => new Date(event.date) >= new Date().setHours(0,0,0,0))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handlePrevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
    }
  };

  const handleDateClick = (day, month = currentDate.getMonth()) => {
    if (!day) return;
    const dateStr = `${currentDate.getFullYear()}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEventForm({ ...eventForm, date: dateStr });
    setShowEventForm(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.date) return;

    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...eventForm, id: editingEvent.id }
          : event
      ));
      setEditingEvent(null);
    } else {
      const newEvent = {
        ...eventForm,
        id: Date.now().toString()
      };
      setEvents([...events, newEvent]);
    }

    setShowEventForm(false);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'work',
      color: '#3B82F6'
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleCancelEdit = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'work',
      color: '#3B82F6'
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newDate) => {
    e.preventDefault();
    if (draggedEvent && newDate) {
      const updatedEvent = { ...draggedEvent, date: newDate };
      setEvents(events.map(event => 
        event.id === draggedEvent.id ? updatedEvent : event
      ));
      setDraggedEvent(null);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = getWeekDays();
  const today = new Date();
  const isToday = (day) => {
    return day && 
           currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  const renderMonthView = () => (
    <>
      <div className="grid grid-cols-7 gap-4 mb-4">
        {t.daysOfWeek.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day, index) => {
          const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
          return (
            <div
              key={index}
              className={`
                min-h-24 p-2 border border-gray-200 rounded-2xl cursor-pointer transition-all
                ${day ? 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-md' : 'bg-gray-50'}
                ${isToday(day) ? 'bg-blue-100 border-blue-400 shadow-md' : ''}
              `}
              onClick={() => handleDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-1 ${isToday(day) ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {getEventsForDate(day).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="text-xs p-1 rounded text-white truncate cursor-move"
                        style={{ backgroundColor: event.color }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, event)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {getEventsForDate(day).length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{getEventsForDate(day).length - 2} {language === 'it' ? 'altri' : 'more'}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const renderWeekView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map(date => {
          const dateStr = formatDate(date);
          const dayEvents = getEventsForDateStr(dateStr);
          const isCurrentDay = formatDate(date) === formatDate(new Date());
          
          return (
            <div
              key={dateStr}
              className={`border border-gray-200 rounded-lg p-4 min-h-32 ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, dateStr)}
            >
              <div className={`text-center font-semibold mb-2 ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
                <div className="text-sm">{t.daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]}</div>
                <div className="text-lg">{date.getDate()}</div>
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className="text-xs p-2 rounded text-white cursor-move"
                    style={{ backgroundColor: event.color }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                  >
                    <div className="font-semibold">{event.title}</div>
                    {event.time && <div>{event.time}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => {
    const dateStr = formatDate(currentDate);
    const dayEvents = getEventsForDateStr(dateStr).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            {t.daysOfWeekFull[currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1]}, {currentDate.getDate()} {t.months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
          {dayEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t.noEvents}</p>
          ) : (
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }}></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{event.title}</h4>
                      {event.time && <p className="text-sm text-gray-600">{event.time}</p>}
                      {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderYearView = () => (
    <div className="grid grid-cols-3 gap-6">
      {t.months.map((month, monthIndex) => {
        const monthDate = new Date(currentDate.getFullYear(), monthIndex, 1);
        const monthDays = getDaysInMonth(monthDate);
        const monthEvents = events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === currentDate.getFullYear() && 
                 eventDate.getMonth() === monthIndex;
        });
        
        return (
          <div key={month} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-center mb-3 text-gray-800">{month}</h3>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-500 p-1">
                  {day}
                </div>
              ))}
              {monthDays.map((day, dayIndex) => {
                const dayEvents = day ? events.filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getFullYear() === currentDate.getFullYear() && 
                         eventDate.getMonth() === monthIndex &&
                         eventDate.getDate() === day;
                }) : [];
                
                return (
                  <div
                    key={dayIndex}
                    className={`
                      text-center p-1 rounded-xl cursor-pointer transition-colors relative
                      ${day ? 'hover:bg-blue-100' : ''}
                      ${dayEvents.length > 0 ? 'font-semibold' : ''}
                    `}
                    onClick={() => {
                      if (day) {
                        setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, day));
                        setViewMode('month');
                      }
                    }}
                  >
                    {day && (
                      <>
                        <div className="relative z-10">{day}</div>
                        {dayEvents.length > 0 && (
                          <div className="flex justify-center mt-1 space-x-1">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: event.color }}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {monthEvents.length} {language === 'it' ? 'eventi' : 'events'}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" id="calendar-content">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <div className="flex items-center space-x-4">
              {/* Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-2xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  Opzioni
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      {/* Language Selector */}
                      <div className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lingua / Language</label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="it">🇮🇹 Italiano</option>
                          <option value="en">🇬🇧 English</option>
                        </select>
                      </div>
                      
                      <hr className="my-2 border-gray-200" />
                      
                      {/* Google Sync */}
                      <button
                        onClick={() => {
                          syncWithGoogleCalendar();
                          setShowOptionsMenu(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                      >
                        <Calendar size={20} className="text-blue-600" />
                        <span className="text-gray-800">{t.syncGoogle}</span>
                      </button>
                      
                      {/* Export PDF */}
                      <button
                        onClick={() => {
                          exportToPDF();
                          setShowOptionsMenu(false);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                      >
                        <Download size={20} className="text-blue-600" />
                        <span className="text-gray-800">{t.export}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* New Event Button */}
              <button
                onClick={() => setShowEventForm(true)}
                className="bg-white text-blue-600 px-6 py-2 rounded-2xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Plus size={20} />
                {t.newEvent}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation and Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {viewMode === 'month' && `${t.months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                {viewMode === 'year' && currentDate.getFullYear()}
                {viewMode === 'week' && `${t.week} - ${t.months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
                {viewMode === 'day' && `${currentDate.getDate()} ${t.months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
              </h2>
              
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {t.today}
              </button>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['month', 'week', 'day', 'year'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {t[mode]}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleNextPeriod}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Calendar Views */}
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
          {viewMode === 'year' && renderYearView()}
        </div>

        {/* Events List with Filters */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{t.upcomingEvents}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t.all}</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {getFilteredEvents().slice(0, 8).map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: event.color }}></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(event.date).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')} {event.time && `- ${event.time}`}
                    </p>
                    {event.description && (
                      <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${categories[event.category].color}`}>
                    {categories[event.category].name}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {getFilteredEvents().length === 0 && (
              <p className="text-center text-gray-500 py-8">{t.noEvents}</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingEvent ? t.editEvent : t.newEvent}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.eventTitle}
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.eventTitle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.description}
                  </label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder={t.description}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.date}
                    </label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.time}
                    </label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.category}
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(categories).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.color}
                  </label>
                  <div className="flex space-x-2">
                    {['#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#F59E0B', '#6B7280'].map(color => (
                      <button
                        key={color}
                        onClick={() => setEventForm({ ...eventForm, color })}
                        className={`w-8 h-8 rounded-full border-2 ${
                          eventForm.color === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {editingEvent ? t.update : t.save}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
                {editingEvent && (
                  <button
                    onClick={() => {
                      handleDeleteEvent(editingEvent.id);
                      handleCancelEdit();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    {t.delete}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalendar;