function renderMapAndMarkers(center, markers) {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: new google.maps.LatLng(center.lat, center.lng),
    });

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(center.lat, center.lng),
        icon: 'https://i.pinimg.com/originals/25/62/aa/2562aacd1a4c2af60cce9629b1e05cf2.png',
        map: map,
    })

    markers.forEach((marker) => {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                marker.latitude,
                marker.longitude
            ),
            map: map,
        });
    });
}

export {
    renderMapAndMarkers
}