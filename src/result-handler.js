/**
 * Display generated tag data in a styled result card.
 * @param {Array} data - Array with single object: [{ pages, nfcLocations, content, characterdetails }]
 */
function displayTagResult(data) {
  // Ensure result area is in DOM
  let resultArea = document.getElementById('resultArea');
  if (!resultArea) {
    console.error('resultArea not found in DOM');
    return;
  }

  try {
    const tag = data[0];
    const details = tag.characterdetails || tag.vehicledetails || {};
    const isVehicle = !!tag.vehicledetails;

    // 1. Update Profile Info
    document.getElementById('charName').textContent = details.name || 'Unknown';
    document.getElementById('charId').textContent = details.id || '--';
    
    // Show world only for characters
    const worldBadge = document.getElementById('worldBadge');
    if (isVehicle) {
      worldBadge.style.display = 'none';
    } else {
      worldBadge.style.display = '';
      document.getElementById('charWorld').textContent = details.world || '--';
    }

    // 2. Determine Icon (vehicle vs character)
    const iconEl = document.getElementById('typeIcon');
    iconEl.innerHTML = isVehicle 
      ? '<i class="bi bi-car-front fs-2"></i>' 
      : '<i class="bi bi-person-fill fs-2"></i>';

    // 3. Build the 5 Code Blocks
    const grid = document.getElementById('codeGrid');
    grid.innerHTML = ''; // Clear old results

    tag.pages.forEach((pageStr, index) => {
      const page = pageStr.replace(/[\[\]]/g, '').trim();
      const location = tag.nfcLocations[index].replace(/[\[\]]/g, '').trim();
      const hexCode = tag.hexCodes[index];
      
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100 border-0 shadow-sm bg-body-tertiary">
          <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 pb-2">
            <div class="d-flex flex-column">
              <small class="fw-bold opacity-75">${escapeHtml(page)}</small>
              <small class="text-muted" style="font-size: 0.75rem;">${escapeHtml(location)}</small>
            </div>
            <button class="btn btn-sm btn-outline-primary py-0 copy-btn" data-value="${hexCode}">Copy</button>
          </div>
          <div class="card-body text-center pt-2">
            <div class="py-3 px-2 rounded border border-secondary-subtle">
              <div class="h5 font-monospace mb-0 text-primary">${escapeHtml(hexCode)}</div>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });

    // Attach copy handlers
    grid.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.value, btn));
    });

    // 4. Show result area
    resultArea.style.display = 'block';
    showStatus('Tag Generated Successfully!', 'success');

  } catch (err) {
    showStatus('Error displaying tag data.', 'danger');
    console.error('displayTagResult error:', err);
  }
}

/**
 * Show temporary status message.
 * @param {string} text 
 * @param {string} type - Bootstrap alert type (success, danger, etc.)
 */
function showStatus(text, type) {
  let box = document.getElementById('statusBox');
  if (!box) {
    // Create if missing
    box = document.createElement('div');
    box.id = 'statusBox';
    box.className = 'alert d-none border-0 shadow-sm mb-4 py-3';
    document.getElementById('output').prepend(box);
  }
  box.textContent = text;
  box.className = `alert alert-${type} border-0 shadow-sm mb-4 py-3 d-block`;
  setTimeout(() => box.classList.add('d-none'), 5000);
}

/**
 * Copy text to clipboard and show feedback.
 * @param {string} val 
 * @param {HTMLElement} btn 
 */
async function copyToClipboard(val, btn) {
  try {
    await navigator.clipboard.writeText(val);
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.replace('btn-outline-primary', 'btn-success');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.replace('btn-success', 'btn-outline-primary');
    }, 1500);
  } catch (err) {
    console.error('Copy failed:', err);
    alert('Failed to copy to clipboard');
  }
}

/**
 * Escape HTML to prevent injection.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str="") {
  return String(str).replace(/[&<>"']/g, c => (
    { "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]
  ));
}
