const CHART_COLORS = {
  chart1: '#e74c3c',
  chart2: '#3498db'
};

const MOBILE_BREAKPOINT = 700;
const SMALL_MOBILE_BREAKPOINT = 480;

// Hardcoded data for each month
const chartData = {
  aug: {
    chart1: [652, 589, 723, 641, 698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634],
    chart2: [223, 198, 245, 221, 234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212]
  },
  sep: {
    chart1: [136, 589, 723, 641, 698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634],
    chart2: [42, 198, 245, 221, 234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212]
  },
  oct: {
    chart1: [589, 723, 641, 698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712],
    chart2: [198, 245, 221, 234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238]
  },
  nov: {
    chart1: [723, 641, 698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689],
    chart2: [245, 221, 234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231]
  },
  dec: {
    chart1: [641, 698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756],
    chart2: [221, 234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256]
  },
  jan: {
    chart1: [698, 567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623],
    chart2: [234, 189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208]
  },
  feb: {
    chart1: [567, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678],
    chart2: [189, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225]
  },
  mar: {
    chart1: [634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745],
    chart2: [212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248]
  },
  apr: {
    chart1: [712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691],
    chart2: [238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233]
  },
  may: {
    chart1: [689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634],
    chart2: [231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212]
  },
  jun: {
    chart1: [756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712, 689, 756, 623, 678, 745, 691, 634, 712],
    chart2: [256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238, 231, 256, 208, 225, 248, 233, 212, 238]
  }
};

let currentChart = null;
let currentMonth = 'sep';


function validateChartData(data) {
  return data && 
         Array.isArray(data.chart1) && 
         Array.isArray(data.chart2) && 
         data.chart1.length > 0 && 
         data.chart2.length > 0;
}


function generateDates(month) {
  const daysInMonth = 31;
  const dates = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(`${i} ${month.charAt(0).toUpperCase() + month.slice(1)}`);
  }
  
  return dates;
}


function updateMetrics(month) {
  const data = chartData[month];
  if (!validateChartData(data)) {
    console.error('Invalid chart data for month:', month);
    return;
  }
  
  const chart1Value = data.chart1[0];
  const chart2Value = data.chart2[0];
  
  const chart1Element = document.querySelector('.chart-1');
  const chart2Element = document.querySelector('.chart-2');
  
  if (chart1Element) chart1Element.textContent = `${chart1Value} GB`;
  if (chart2Element) chart2Element.textContent = `${chart2Value} GB`;
}


function createChartConfig(month) {
  const data = chartData[month];
  if (!validateChartData(data)) {
    throw new Error(`Invalid data for month: ${month}`);
  }
  
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const isSmallMobile = window.innerWidth <= SMALL_MOBILE_BREAKPOINT;
  
  return {
    type: 'line',
    data: {
      labels: generateDates(month),
      datasets: [
        {
          label: 'Chart 1',
          data: data.chart1,
          borderColor: CHART_COLORS.chart1,
          backgroundColor: `${CHART_COLORS.chart1}1a`,
          borderWidth: isMobile ? 2 : 3,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: isMobile ? 4 : 6,
          pointHoverBackgroundColor: CHART_COLORS.chart1
        },
        {
          label: 'Chart 2',
          data: data.chart2,
          borderColor: CHART_COLORS.chart2,
          backgroundColor: `${CHART_COLORS.chart2}1a`,
          borderWidth: isMobile ? 2 : 3,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: isMobile ? 4 : 6,
          pointHoverBackgroundColor: CHART_COLORS.chart2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'transparent',
          borderWidth: 0,
          cornerRadius: 8,
          displayColors: false,
          titleFont: { size: isMobile ? 12 : 14 },
          bodyFont: { size: isMobile ? 11 : 13 },
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y} GB`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#888',
            font: { size: isMobile ? 10 : 12 },
            maxRotation: 45,
            minRotation: 45,
            autoSkip: isMobile,
            maxTicksLimit: isMobile ? 8 : 15
          }
        },
        y: {
          grid: { color: '#f0f0f0' },
          ticks: {
            color: '#888',
            font: { size: isMobile ? 10 : 12 },
            callback: function(value) {
              return value + ' GB';
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  };
}


function createChart(month) {
  try {
    const ctx = document.getElementById('mainChart');
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }
    
    if (currentChart) {
      currentChart.destroy();
    }
    
    const config = createChartConfig(month);
    currentChart = new Chart(ctx, config);
  } catch (error) {
    console.error('Error creating chart:', error);

    const container = document.querySelector('.chart-container');
    if (container) {
      container.innerHTML = '<p style="text-align: center; color: #888;">Chart loading error</p>';
    }
  }
}

// Function to show months based on screen size
function updateMonthNavigation() {
  const isMobile = window.innerWidth <= 700;
  const monthButtons = document.querySelectorAll('.month-btn');
  const activeMonth = document.querySelector('.month-btn.active');
  const activeIndex = Array.from(monthButtons).indexOf(activeMonth);
  
  monthButtons.forEach((btn, index) => {
    if (isMobile) {
      let shouldShow = false;
      
      if (activeIndex === 0) {
        shouldShow = index <= 2;
      } else if (activeIndex === monthButtons.length - 1) {
        shouldShow = index >= monthButtons.length - 3;
      } else {
        shouldShow = index >= activeIndex - 1 && index <= activeIndex + 1;
      }
      
      btn.style.display = shouldShow ? 'block' : 'none';
    } else {
      btn.style.display = 'block';
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  createChart(currentMonth);
  updateMetrics(currentMonth);
  updateMonthNavigation();
  
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      createChart(currentMonth);
      updateMonthNavigation();
    }, 250);
  });
  
  document.querySelectorAll('.month-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const month = this.dataset.month;
      
      document.querySelectorAll('.month-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      currentMonth = month;
      createChart(month);
      updateMetrics(month);
      updateMonthNavigation();
    });
  });
  
  document.querySelector('.nav-prev').addEventListener('click', function() {
    const activeBtn = document.querySelector('.month-btn.active');
    const prevBtn = activeBtn.previousElementSibling;
    if (prevBtn && prevBtn.classList.contains('month-btn') && prevBtn.style.display !== 'none') {
      prevBtn.click();
    }
  });
  
  document.querySelector('.nav-next').addEventListener('click', function() {
    const activeBtn = document.querySelector('.month-btn.active');
    const nextBtn = activeBtn.nextElementSibling;
    if (nextBtn && nextBtn.classList.contains('month-btn') && nextBtn.style.display !== 'none') {
      nextBtn.click();
    }
  });
}); 