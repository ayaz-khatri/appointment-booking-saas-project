setTimeout(() => {
    document.querySelectorAll('.flash-alert').forEach(alert => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    });
}, 4000);
