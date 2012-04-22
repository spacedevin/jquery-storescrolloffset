### jQuery Store Scroll Offset

Stores the scrollleft and scroll top positions in cookies. Requires cookie plugin.

https://github.com/carhartl/jquery-cookie


### Usage
```javascript
$('.portfolio-group').storeScrollOffset();
```

or

```javascript
$('.portfolio-group').storeScrollOffset({
    snap: '.portfolio-item',
    padding: {
        left: -10,
        top: 0
    }
});
```

### License
MIT & GPLv2