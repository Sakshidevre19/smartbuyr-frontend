import './SizeGuide.css'

export function SizeGuide({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="size-guide-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Size Guide</h2>
        
        <div className="size-guide-content">
          <div className="size-section">
            <h3>👕 Clothing Sizes</h3>
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hip (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>XS</td><td>32-34</td><td>26-28</td><td>34-36</td></tr>
                <tr><td>S</td><td>34-36</td><td>28-30</td><td>36-38</td></tr>
                <tr><td>M</td><td>36-38</td><td>30-32</td><td>38-40</td></tr>
                <tr><td>L</td><td>38-40</td><td>32-34</td><td>40-42</td></tr>
                <tr><td>XL</td><td>40-42</td><td>34-36</td><td>42-44</td></tr>
                <tr><td>XXL</td><td>42-44</td><td>36-38</td><td>44-46</td></tr>
              </tbody>
            </table>
          </div>

          <div className="size-section">
            <h3>👟 Shoe Sizes</h3>
            <div className="shoe-sizes">
              <div className="shoe-column">
                <h4>Men's Sizes</h4>
                <table className="size-table">
                  <thead>
                    <tr><th>US</th><th>UK</th><th>EU</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>7</td><td>6</td><td>40</td></tr>
                    <tr><td>8</td><td>7</td><td>41</td></tr>
                    <tr><td>9</td><td>8</td><td>42</td></tr>
                    <tr><td>10</td><td>9</td><td>43</td></tr>
                    <tr><td>11</td><td>10</td><td>44</td></tr>
                    <tr><td>12</td><td>11</td><td>45</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div className="shoe-column">
                <h4>Women's Sizes</h4>
                <table className="size-table">
                  <thead>
                    <tr><th>US</th><th>UK</th><th>EU</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>6</td><td>3.5</td><td>36</td></tr>
                    <tr><td>7</td><td>4.5</td><td>37</td></tr>
                    <tr><td>8</td><td>5.5</td><td>38</td></tr>
                    <tr><td>9</td><td>6.5</td><td>39</td></tr>
                    <tr><td>10</td><td>7.5</td><td>40</td></tr>
                    <tr><td>11</td><td>8.5</td><td>41</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="size-tips">
            <h3>📏 Measuring Tips</h3>
            <ul>
              <li>Measure yourself in underwear for most accurate results</li>
              <li>Use a soft measuring tape</li>
              <li>For chest: Measure around the fullest part</li>
              <li>For waist: Measure around the narrowest part</li>
              <li>For shoes: Measure feet in the evening when they're largest</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}