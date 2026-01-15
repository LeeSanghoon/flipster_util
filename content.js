(function () {

  function makeTableSortableWithIndicator(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
      console.error(`Table with ID "${tableId}" not found.`);
      return;
    }

    const headers = table.querySelectorAll('th');
    const tbody = table.querySelector('tbody');
    let currentSortColumn = -1; // 현재 정렬된 컬럼의 인덱스
    let currentSortDirection = 'asc'; // 현재 정렬 방향

    // 모든 헤더에 정렬 표시기 추가
    headers.forEach(header => {
      const sortIndicator = document.createElement('span');
      sortIndicator.classList.add('sort-indicator');
      sortIndicator.innerHTML = '&nbsp;'; // 초기에는 공백
      header.querySelector('div').appendChild(sortIndicator);
    });

    headers.forEach((header, index) => {
      header.style.cursor = 'pointer';

      header.addEventListener('click', () => {
        const rows = Array.from(tbody.querySelectorAll('tr'));

        if (currentSortColumn === index) {
          // 같은 컬럼을 다시 클릭하면 정렬 방향 토글
          currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          // 다른 컬럼을 클릭하면 해당 컬럼으로 변경하고 오름차순으로 초기화
          currentSortColumn = index;
          currentSortDirection = 'asc';
          // 다른 헤더의 정렬 표시 초기화
          headers.forEach(h => {
            const indicator = h.querySelector('.sort-indicator');
            if (indicator) indicator.innerHTML = '&nbsp;';
          });
        }

        const sortedRows = rows.sort((rowA, rowB) => {
          const cellA = rowA.querySelectorAll('td')[index].textContent.trim();
          const cellB = rowB.querySelectorAll('td')[index].textContent.trim();

          let comparison = 0;
          const numA = parseFloat(cellA);
          const numB = parseFloat(cellB);

          if (!isNaN(numA) && !isNaN(numB)) {
            comparison = numA - numB;
          } else {
            comparison = cellA.localeCompare(cellB);
          }

          return currentSortDirection === 'asc' ? comparison : -comparison;
        });

        // tbody 업데이트
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        sortedRows.forEach(row => tbody.appendChild(row));

        // 정렬 표시기 업데이트
        const currentIndicator = header.querySelector('.sort-indicator');
        if (currentIndicator) {
          currentIndicator.innerHTML = currentSortDirection === 'asc' ? ' ▴' : ' ▾'; // 위/아래 화살표
        }
      });
    });
  }

  function updatePositionTable() {
    // UID 84335인 table 요소가 현재 선택되어 있지 않으므로, 직접 선택자를 사용합니다.
    // 만약 이 table에 고유한 ID가 있다면, getElementById를 사용하는 것이 가장 좋습니다.
    // 여기서는 일반적인 table 선택자를 사용하되, 특정 클래스 선택자를 참고하겠습니다.
    const targetTable = document.querySelector('table'); // 가장 단순하게 첫 번째 table 태그를 찾습니다.
    // 만약 이 table이 '.p9M_bs.pSZb1I.Um_faP' 내부에 있고 유일하다면 다음과 같이 더 정확하게 선택할 수 있습니다.
    // const targetTable = document.querySelector('.p9M_bs.pSZb1I.Um_faP table');

    if (targetTable) {
      // 테이블에 임시 ID를 부여하여 makeTableSortable 함수가 사용할 수 있도록 합니다.
      const tempId = 'devtool-sortable-table-' + Math.random().toString(36).substr(2, 9);
      targetTable.setAttribute('id', tempId);
      makeTableSortableWithIndicator(tempId);
      console.log(`Table made sortable with temporary ID: ${tempId}`);
    } else {
      console.error('Could not find the target table element.');
    }
  }




  const defaultHeight = 750;

  function updateChartHeight(defaultHeight) {
    const section = document.querySelector("section#tradingview");
    if (!section) return;

    const parentDiv = section.closest("div");
    if (!parentDiv) return;

    parentDiv.style.height = `${defaultHeight}px`;
    //parentDiv.style.maxHeight = `${defaultHeight}px`;
    //parentDiv.style.overflow = "auto";
  }

  function updateOrderBlockSectionHeight(defaultHeight) {
    const section = document.querySelector(".oVqlU");
    if (!section) return;

    section.style.height = `${defaultHeight + 44}px`;
  }

  const applyChanges = () => {
    updateChartHeight(defaultHeight);
    updateOrderBlockSectionHeight(defaultHeight);
    updatePositionTable();
  };

  // DOM이 완전히 로드된 후 실행
  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(applyChanges, 3000); // delay
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(applyChanges, 3000);
    });
  }
})();





